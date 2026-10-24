import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { Summary } from './Cart'

const fields = [
  ['name', 'Full name'],
  ['email', 'Email', 'email'],
  ['phone', 'Phone'],
  ['address', 'Street address'],
  ['city', 'City'],
  ['zip', 'Postal code'],
]

const fieldset = 'box mb-5 p-5'
const grid = 'mt-3 grid gap-4 sm:grid-cols-2'
const label = 'grid gap-1 text-sm font-medium'

export default function Checkout() {
  const { lines, placeOrder } = useCart()
  const { settings } = useStore()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', zip: '', card: '', exp: '', cvc: '' })
  const [method, setMethod] = useState(settings.acceptCard ? 'card' : 'cod')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  if (!lines.length)
    return <div className="empty">Nothing to check out. <Link className="text-brand" to="/">Go shopping</Link></div>

  const submit = (e) => {
    e.preventDefault()
    // Payment fields are deliberately not stored.
    const { card, exp, cvc, ...customer } = form
    const order = placeOrder({ ...customer, method })
    nav(`/order/${order.id}`)
  }

  return (
    <div className="wrap">
      <h1 className="mb-4 text-3xl font-bold">Checkout</h1>
      <form className="grid items-start gap-8 md:grid-cols-[2fr_1fr]" onSubmit={submit}>
        <div>
          <fieldset className={fieldset}>
            <legend className="px-2 font-bold">Shipping details</legend>
            <div className={grid}>
              {fields.map(([k, text, type]) => (
                <label key={k} className={`${label} ${k === 'address' ? 'sm:col-span-2' : ''}`}>{text}
                  <input required type={type || 'text'} value={form[k]} onChange={set(k)} />
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className={fieldset}>
            <legend className="px-2 font-bold">Payment</legend>
            <div className="flex gap-2">
              {settings.acceptCard && (
                <button type="button" className={`chip ${method === 'card' ? 'chip-active' : ''}`} onClick={() => setMethod('card')}>Card</button>
              )}
              {settings.acceptCod && (
                <button type="button" className={`chip ${method === 'cod' ? 'chip-active' : ''}`} onClick={() => setMethod('cod')}>Cash on delivery</button>
              )}
            </div>
            {method === 'card' && (
              <div className={grid}>
                <label className={`${label} sm:col-span-2`}>Card number
                  <input required inputMode="numeric" maxLength={19} placeholder="1234 5678 9012 3456" value={form.card} onChange={set('card')} />
                </label>
                <label className={label}>Expiry<input required placeholder="MM/YY" maxLength={5} value={form.exp} onChange={set('exp')} /></label>
                <label className={label}>CVC<input required maxLength={4} value={form.cvc} onChange={set('cvc')} /></label>
              </div>
            )}
            <p className="mt-3 text-sm text-slate-500">Demo store: no payment is processed and card details are not saved.</p>
          </fieldset>
        </div>
        <div>
          <Summary />
          {lines.map((l) => (
            <div className="my-2 flex items-center gap-3" key={l.id + l.size}>
              <img className="size-14 rounded-lg object-cover" src={l.product.images[0]} alt="" />
              <span className="flex-1">{l.product.name} × {l.qty}</span>
            </div>
          ))}
          <button className="btn btn-block" type="submit">Place order</button>
        </div>
      </form>
    </div>
  )
}
