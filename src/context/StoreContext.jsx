import { createContext, useContext, useEffect, useState } from 'react'
import { products as seedProducts } from '../data/products'

const StoreContext = createContext(null)

export const ORDER_STEPS = ['Order placed', 'Processing', 'Shipped', 'Out for delivery', 'Delivered']

export const defaultSettings = {
  storeName: 'LinkShop',
  storeSlug: 'linkshop',
  logo: '',
  banner: '',
  tagline: 'Quality products, delivered to your door.',
  email: 'support@linkshop.com',
  phone: '',
  address: '',
  shippingFee: 7.5,
  freeShippingOver: 100,
  lowStockLimit: 5,
  acceptCard: true,
  acceptCod: true,
}

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

const newOrderId = () => 'LS' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10)

// Saved products that still use the old placeholder pictures get the real photos; other edits are kept.
const upgradeImages = (list) =>
  list.map((p) => {
    const seed = seedProducts.find((s) => s.id === p.id)
    return seed && p.images.some((u) => u.includes('picsum.photos')) ? { ...p, images: seed.images } : p
  })

// Browsers that already saved a catalogue also receive newly added sample products once.
// `seenSeedIds` remembers which sample products were already offered, so a product the seller
// deleted does not come back. Before this existed, the first 18 samples were the whole catalogue.
const loadProducts = () => {
  const saved = load('products', null)
  if (!saved) return seedProducts
  const seen = load('seenSeedIds', seedProducts.slice(0, 18).map((p) => p.id))
  return upgradeImages([...saved, ...seedProducts.filter((s) => !seen.includes(s.id))])
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(loadProducts)
  const [orders, setOrders] = useState(() => load('orders', []))
  const [settings, setSettingsState] = useState(() => ({ ...defaultSettings, ...load('settings', {}) }))

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
    localStorage.setItem('seenSeedIds', JSON.stringify(seedProducts.map((p) => p.id)))
  }, [products])
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings])

  const getProduct = (id) => products.find((p) => p.id === id)

  // ----- products -----
  const saveProduct = (p) =>
    setProducts((prev) => (prev.some((x) => x.id === p.id) ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev]))
  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id))
  const setStock = (id, stock) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, Math.floor(stock) || 0) } : p)))

  // ----- orders -----
  const createOrder = (customer, lines, totals) => {
    const order = {
      id: newOrderId(),
      date: new Date().toISOString(),
      step: 0,
      cancelled: false,
      customer,
      lines: lines.map((l) => ({
        id: l.id,
        name: l.product.name,
        image: l.product.images[0],
        price: l.product.price,
        qty: l.qty,
        size: l.size,
      })),
      ...totals,
    }
    setOrders((prev) => [order, ...prev])
    setProducts((prev) =>
      prev.map((p) => {
        const hit = lines.find((l) => l.id === p.id)
        return hit ? { ...p, stock: Math.max(0, (p.stock ?? 0) - hit.qty) } : p
      }),
    )
    return order
  }
  const updateOrder = (id, patch) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  const cancelOrder = (id) => {
    const order = orders.find((o) => o.id === id)
    if (!order || order.cancelled) return
    updateOrder(id, { cancelled: true })
    setProducts((prev) =>
      prev.map((p) => {
        const hit = order.lines.find((l) => l.id === p.id)
        return hit ? { ...p, stock: (p.stock ?? 0) + hit.qty } : p
      }),
    )
  }
  const findOrder = (id) => orders.find((o) => o.id === id.trim().toUpperCase())

  const seedDemoOrders = () => {
    const names = ['Amina Yusuf', 'John Okafor', 'Sara Ahmed', 'David Mensah', 'Linda Obi', 'Musa Bello']
    const pool = products.filter((p) => p.active !== false)
    if (!pool.length) return
    const demo = Array.from({ length: 10 }, (_, i) => {
      const lines = Array.from({ length: 1 + (i % 3) }, (_, j) => {
        const p = pool[(i * 3 + j * 5) % pool.length]
        return { id: p.id, name: p.name, image: p.images[0], price: p.price, qty: 1 + ((i + j) % 2), size: p.sizes ? p.sizes[0] : null }
      })
      const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0)
      const shipping = subtotal >= settings.freeShippingOver ? 0 : settings.shippingFee
      const name = names[i % names.length]
      return {
        id: newOrderId() + i,
        date: new Date(Date.now() - (i % 7) * 864e5 - i * 36e5).toISOString(),
        step: i % 5,
        cancelled: i === 7,
        customer: {
          name,
          email: name.split(' ')[0].toLowerCase() + '@example.com',
          phone: '0800 000 000' + i,
          address: `${10 + i} Market Street`,
          city: 'Lagos',
          zip: '1000' + i,
          method: i % 2 ? 'cod' : 'card',
        },
        lines,
        subtotal,
        shipping,
        total: subtotal + shipping,
      }
    })
    setOrders((prev) => [...demo, ...prev])
  }

  // ----- settings -----
  const setSettings = (patch) => setSettingsState((prev) => ({ ...prev, ...patch }))
  const resetAll = () => {
    setProducts(seedProducts)
    setOrders([])
    setSettingsState(defaultSettings)
  }

  return (
    <StoreContext.Provider
      value={{
        products, orders, settings,
        getProduct, saveProduct, deleteProduct, setStock,
        createOrder, updateOrder, cancelOrder, findOrder, seedDemoOrders,
        setSettings, resetAll,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
