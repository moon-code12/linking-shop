import { createContext, useContext, useEffect, useState } from 'react'
import { useStore } from './StoreContext'

const CartContext = createContext(null)
const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function CartProvider({ children }) {
  const { getProduct, settings, createOrder } = useStore()
  const [items, setItems] = useState(() => load('cart', [])) // {id, qty, size}

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Never let the cart hold more than the seller has in stock.
  const clamp = (id, qty) => {
    const stock = getProduct(id)?.stock
    return Math.max(1, stock > 0 ? Math.min(qty, stock) : qty)
  }

  const add = (id, qty = 1, size = null) =>
    setItems((prev) => {
      const hit = prev.find((i) => i.id === id && i.size === size)
      if (hit) return prev.map((i) => (i === hit ? { ...i, qty: clamp(id, i.qty + qty) } : i))
      return [...prev, { id, qty: clamp(id, qty), size }]
    })
  const setQty = (id, size, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, qty: clamp(id, qty) } : i)))
  const remove = (id, size) => setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)))

  const lines = items
    .map((i) => ({ ...i, product: getProduct(i.id) }))
    .filter((l) => l.product && l.product.active !== false && l.product.stock > 0)
  const count = lines.reduce((n, l) => n + l.qty, 0)
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0)
  const shipping = subtotal === 0 || subtotal >= settings.freeShippingOver ? 0 : settings.shippingFee
  const total = subtotal + shipping

  const placeOrder = (customer) => {
    const order = createOrder(customer, lines, { subtotal, shipping, total })
    setItems([])
    return order
  }

  return (
    <CartContext.Provider value={{ lines, count, subtotal, shipping, total, add, setQty, remove, placeOrder }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
