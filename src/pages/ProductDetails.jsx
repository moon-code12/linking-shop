import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useCart } from '../context/CartContext'
import ProductCard, { money } from '../components/ProductCard'

export default function ProductDetails() {
  const { id } = useParams()
  const { getProduct, products, settings } = useStore()
  const p = getProduct(id)
  const { add } = useCart()
  const [active, setActive] = useState(0)
  const [size, setSize] = useState(p?.sizes?.[0] ?? null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!p || p.active === false)
    return <div className="empty">Product not found. <Link className="text-brand" to="/">Back to shop</Link></div>

  const soldOut = !(p.stock > 0)
  const related = products.filter((x) => x.active !== false && x.category === p.category && x.id !== p.id).slice(0, 4)
  const onAdd = () => {
    add(p.id, qty, size)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="wrap" key={p.id}>
      <p className="mb-4 text-sm text-slate-500"><Link to="/" className="hover:text-brand">Shop</Link> / {p.category} / {p.name}</p>
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div>
          <img className="aspect-square w-full rounded-2xl object-cover" src={p.images[active] ?? p.images[0]} alt={p.name} />
          <div className="mt-2.5 grid grid-cols-4 gap-2.5">
            {p.images.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt=""
                onClick={() => setActive(i)}
                className={`aspect-square w-full cursor-pointer rounded-lg border-2 object-cover ${i === active ? 'border-brand' : 'border-transparent opacity-70'}`}
              />
            ))}
          </div>
        </div>
        <div className="grid content-start gap-4">
          <h1 className="text-2xl font-bold md:text-3xl">{p.name}</h1>
          <div className="text-sm text-slate-500">★ {p.rating.toFixed(1)} ({p.reviews} reviews)</div>
          <div className="text-3xl font-bold">{money(p.price)} {p.oldPrice && <s className="ml-1 text-lg font-normal text-slate-500">{money(p.oldPrice)}</s>}</div>
          <p>{p.description}</p>
          {soldOut ? (
            <p className="font-semibold text-red-600">Out of stock</p>
          ) : (
            p.stock <= settings.lowStockLimit && <p className="font-semibold text-amber-600">Only {p.stock} left</p>
          )}
          {p.sizes?.length > 0 && (
            <div>
              <strong>Size</strong>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button key={s} className={`chip ${s === size ? 'chip-active' : ''}`} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock || 1, qty + 1))}>+</button>
            </div>
            <button className="btn disabled:cursor-not-allowed disabled:opacity-50" disabled={soldOut} onClick={onAdd}>
              {soldOut ? 'Out of stock' : added ? 'Added ✓' : 'Add to cart'}
            </button>
          </div>
          <ul className="list-disc space-y-1 pl-5 text-slate-500">
            <li>Free shipping on orders over ${settings.freeShippingOver}</li>
            <li>30-day returns</li>
            <li>Secure checkout</li>
          </ul>
        </div>
      </div>
      {related.length > 0 && (
        <>
          <h2 className="mb-4 mt-10 text-2xl font-bold">You may also like</h2>
          <div className="product-grid">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </>
      )}
    </div>
  )
}
