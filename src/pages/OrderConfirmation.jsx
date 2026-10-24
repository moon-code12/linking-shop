import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ORDER_STEPS, useStore } from '../context/StoreContext'
import { money } from '../components/ProductCard'

export function Track() {
  const [id, setId] = useState('')
  const nav = useNavigate()
  return (
    <div className="wrap max-w-3xl">
      <h1 className="mb-4 text-3xl font-bold">Track your order</h1>
      <form className="flex gap-2.5" onSubmit={(e) => { e.preventDefault(); nav(`/order/${id.trim().toUpperCase()}`) }}>
        <input className="flex-1" required value={id} onChange={(e) => setId(e.target.value)} placeholder="Order number, e.g. LS12345678" />
        <button className="btn">Track</button>
      </form>
    </div>
  )
}

export default function OrderConfirmation() {
  const { id } = useParams()
  const { findOrder } = useStore()
  const order = findOrder(id)

  if (!order)
    return <div className="empty">Order "{id}" not found on this device. <Link className="text-brand" to="/track">Try again</Link></div>

  // The seller moves the order along from the dashboard.
  const step = order.step ?? 0
  const placed = new Date(order.date)
  const eta = new Date(placed.getTime() + 5 * 864e5).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="wrap max-w-3xl">
      <div className="box grid justify-items-center gap-2 p-8 text-center">
        {order.cancelled ? (
          <div className="grid size-16 place-items-center rounded-full bg-red-600 text-3xl text-white">✕</div>
        ) : (
          <div className="grid size-16 place-items-center rounded-full bg-green-600 text-3xl text-white">✓</div>
        )}
        <h1 className="text-3xl font-bold">
          {order.cancelled ? 'Order cancelled' : `Thank you, ${order.customer.name.split(' ')[0]}!`}
        </h1>
        <p>
          Your order <strong>{order.id}</strong> {order.cancelled ? 'was cancelled.' : `is confirmed. A receipt was sent to ${order.customer.email}.`}
        </p>
        {!order.cancelled && <p className="text-sm text-slate-500">Estimated delivery: {eta}</p>}
      </div>

      {!order.cancelled && (
        <>
          <h2 className="mb-4 mt-8 text-2xl font-bold">Order tracking</h2>
          <ol className="ml-2.5 border-l-[3px] border-slate-200">
            {ORDER_STEPS.map((s, i) => (
              <li key={s} className={`relative pb-5 pl-6 ${i <= step ? 'font-semibold' : 'text-slate-500'}`}>
                <span className={`absolute -left-[0.6rem] top-1 size-4 rounded-full ${i <= step ? 'bg-green-600' : 'bg-slate-200'}`} />
                {s}
              </li>
            ))}
          </ol>
        </>
      )}

      <h2 className="mb-4 mt-8 text-2xl font-bold">Items</h2>
      {order.lines.map((l) => (
        <div className="my-2 flex items-center gap-3" key={l.id + l.size}>
          <img className="size-14 rounded-lg object-cover" src={l.image} alt="" />
          <span className="flex-1">{l.name}{l.size && ` (${l.size})`} × {l.qty}</span>
          <strong>{money(l.price * l.qty)}</strong>
        </div>
      ))}
      <div className="box my-4 grid gap-2.5 p-5">
        <div className="flex justify-between"><span>Shipping</span><span>{order.shipping ? money(order.shipping) : 'Free'}</span></div>
        <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{money(order.total)}</span></div>
      </div>
      <p className="mb-4"><strong>Ships to:</strong> {order.customer.address}, {order.customer.city} {order.customer.zip}</p>
      <Link className="btn" to="/">Continue shopping</Link>
    </div>
  )
}
