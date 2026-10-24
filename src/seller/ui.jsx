import { ORDER_STEPS } from '../context/StoreContext'

export const orderLabel = (o) => (o.cancelled ? 'Cancelled' : ORDER_STEPS[o.step ?? 0])

const colors = {
  Cancelled: 'bg-red-100 text-red-700',
  'Order placed': 'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  'Out for delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  'In stock': 'bg-green-100 text-green-700',
  'Low stock': 'bg-amber-100 text-amber-700',
  'Out of stock': 'bg-red-100 text-red-700',
  Published: 'bg-green-100 text-green-700',
  Hidden: 'bg-slate-200 text-slate-600',
  Active: 'bg-green-100 text-green-700',
  Suspended: 'bg-red-100 text-red-700',
}

export function Badge({ label }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors[label] ?? 'bg-slate-100'}`}>
      {label}
    </span>
  )
}

export const stockLabel = (stock, limit) => (stock <= 0 ? 'Out of stock' : stock <= limit ? 'Low stock' : 'In stock')

export const th = 'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500'
export const td = 'px-4 py-3'
export const rowCls = 'border-t border-slate-100'

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export function Stat({ label, value, hint }) {
  return (
    <div className="box p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
