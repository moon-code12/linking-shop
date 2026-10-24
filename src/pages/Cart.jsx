import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { money } from '../components/ProductCard'

export function Summary() {
  const { subtotal, shipping, total } = useCart()
  return (
    <div className="box my-4 grid gap-2.5 p-5">
      <h3 className="text-lg font-bold">Order summary</h3>
      <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
      <div className="flex justify-between"><span>Shipping</span><span>{shipping ? money(shipping) : 'Free'}</span></div>
      <div className="flex justify-between border-t border-slate-200 pt-2.5 text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>
    </div>
  )
}

export default function Cart() {
  const { lines, setQty, remove } = useCart()
  if (!lines.length)
    return (
      <div className="empty">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link className="btn" to="/">Continue shopping</Link>
      </div>
    )
  return (
    <div className="wrap">
      <h1 className="mb-4 text-3xl font-bold">Shopping cart</h1>
      <div className="grid items-start gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          {lines.map((l) => (
            <div className="box mb-3 flex flex-wrap items-center gap-x-4 gap-y-3 p-3" key={l.id + l.size}>
              <img className="size-20 rounded-lg object-cover" src={l.product.images[0]} alt="" />
              <div className="min-w-0 flex-1 basis-40">
                <Link to={`/product/${l.id}`}><strong>{l.product.name}</strong></Link>
                {l.size && <div className="text-sm text-slate-500">Size: {l.size}</div>}
                <div>{money(l.product.price)}</div>
                <button className="mt-1 text-sm text-red-600" onClick={() => remove(l.id, l.size)}>Remove</button>
              </div>
              <div className="flex w-full items-center justify-between sm:w-auto sm:gap-4">
                <div className="qty">
                  <button onClick={() => setQty(l.id, l.size, l.qty - 1)}>−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => setQty(l.id, l.size, l.qty + 1)}>+</button>
                </div>
                <strong className="min-w-[4.5rem] text-right">{money(l.product.price * l.qty)}</strong>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Summary />
          <Link className="btn btn-block" to="/checkout">Proceed to checkout</Link>
        </div>
      </div>
    </div>
  )
}
