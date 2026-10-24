import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export const money = (n) => `$${n.toFixed(2)}`

export default function ProductCard({ p }) {
  const { add } = useCart()
  const sale = p.oldPrice && Math.round((1 - p.price / p.oldPrice) * 100)
  const soldOut = !(p.stock > 0)
  return (
    <article className="box group overflow-hidden transition-shadow hover:shadow-xl">
      <Link to={`/product/${p.id}`} className="relative block aspect-square overflow-hidden">
        <img className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${soldOut ? 'opacity-50' : ''}`} src={p.images[0]} alt={p.name} loading="lazy" />
        {soldOut ? (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-slate-800 px-2 py-0.5 text-xs text-white">Sold out</span>
        ) : (
          sale && <span className="absolute left-2.5 top-2.5 rounded-md bg-red-600 px-2 py-0.5 text-xs text-white">-{sale}%</span>
        )}
      </Link>
      <div className="grid gap-1.5 p-3 sm:p-3.5">
        <small className="text-slate-500">{p.category}</small>
        <Link to={`/product/${p.id}`}><h3 className="line-clamp-2 text-sm font-semibold sm:text-base">{p.name}</h3></Link>
        <div className="font-bold">{money(p.price)} {p.oldPrice && <s className="ml-1 font-normal text-slate-500">{money(p.oldPrice)}</s>}</div>
        <button
          className="btn !px-3 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={soldOut}
          onClick={() => add(p.id, 1, p.sizes?.length ? p.sizes[0] : null)}
        >
          {soldOut ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </article>
  )
}
