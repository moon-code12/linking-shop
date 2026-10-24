import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { money } from '../components/ProductCard'
import { PageHeader, Stat, rowCls, td, th } from './ui'

const DAY = 864e5
const startOfDay = (t) => new Date(new Date(t).toDateString()).getTime()

const pct = (now, before) => {
  if (!before) return now ? 'New activity' : 'No change'
  const d = Math.round(((now - before) / before) * 100)
  return `${d >= 0 ? '+' : ''}${d}% vs previous period`
}

function Bars({ rows, format }) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <div className="grid gap-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span>{r.label}</span>
            <span className="font-medium">{format ? format(r.value) : r.value}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-brand" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
      {!rows.length && <p className="text-sm text-slate-500">No data yet.</p>}
    </div>
  )
}

export default function Analytics() {
  const { orders, getProduct } = useStore()
  const [range, setRange] = useState(7)

  const today = startOfDay(Date.now())
  const from = today - (range - 1) * DAY
  const prevFrom = from - range * DAY

  const live = orders.filter((o) => !o.cancelled)
  const inRange = live.filter((o) => startOfDay(o.date) >= from)
  const inPrev = live.filter((o) => startOfDay(o.date) >= prevFrom && startOfDay(o.date) < from)

  const revenue = inRange.reduce((n, o) => n + o.total, 0)
  const prevRevenue = inPrev.reduce((n, o) => n + o.total, 0)
  const units = inRange.reduce((n, o) => n + o.lines.reduce((m, l) => m + l.qty, 0), 0)

  const days = Array.from({ length: range }, (_, i) => {
    const t = from + i * DAY
    const day = inRange.filter((o) => startOfDay(o.date) === t)
    return {
      label: new Date(t).toLocaleDateString(undefined, range === 7 ? { weekday: 'short' } : { day: 'numeric', month: 'short' }),
      revenue: day.reduce((n, o) => n + o.total, 0),
      orders: day.length,
    }
  })
  const peak = Math.max(...days.map((d) => d.revenue), 1)

  const byProduct = {}
  const byCategory = {}
  inRange.forEach((o) => o.lines.forEach((l) => {
    const p = (byProduct[l.id] ??= { name: l.name, image: l.image, units: 0, revenue: 0 })
    p.units += l.qty
    p.revenue += l.qty * l.price
    const cat = getProduct(l.id)?.category ?? 'Other'
    byCategory[cat] = (byCategory[cat] ?? 0) + l.qty * l.price
  }))
  const products = Object.values(byProduct).sort((a, b) => b.revenue - a.revenue)
  const categories = Object.entries(byCategory).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)

  const payment = [
    { label: 'Card', value: inRange.filter((o) => o.customer.method !== 'cod').length },
    { label: 'Cash on delivery', value: inRange.filter((o) => o.customer.method === 'cod').length },
  ]

  return (
    <>
      <PageHeader title="Analytics" subtitle="Sales trends and product performance. Cancelled orders are excluded.">
        <div className="flex gap-2">
          {[7, 30].map((r) => (
            <button key={r} className={`chip ${r === range ? 'chip-active' : ''}`} onClick={() => setRange(r)}>Last {r} days</button>
          ))}
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Revenue" value={money(revenue)} hint={pct(revenue, prevRevenue)} />
        <Stat label="Orders" value={inRange.length} hint={pct(inRange.length, inPrev.length)} />
        <Stat label="Average order value" value={money(inRange.length ? revenue / inRange.length : 0)} />
        <Stat label="Units sold" value={units} />
      </div>

      <section className="box mt-6 p-5">
        <h2 className="font-bold">Revenue trend</h2>
        <div className="mt-4 flex h-56 items-end gap-1 sm:gap-2">
          {days.map((d, i) => (
            <div key={d.label + i} className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span className="pointer-events-none absolute -top-1 z-10 hidden whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
                {d.label}: {money(d.revenue)} · {d.orders} orders
              </span>
              <div className="w-full rounded-t bg-brand" style={{ height: `${(d.revenue / peak) * 85}%`, minHeight: d.revenue ? 4 : 2, opacity: d.revenue ? 1 : 0.2 }} />
              <span className="h-4 w-full truncate text-center text-[10px] text-slate-500">
                {range === 7 || i % 5 === 0 ? d.label : ''}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="box p-5">
          <h2 className="mb-4 font-bold">Revenue by category</h2>
          <Bars rows={categories} format={money} />
        </section>
        <section className="box p-5">
          <h2 className="mb-4 font-bold">Payment methods</h2>
          <Bars rows={payment} />
          <h2 className="mb-4 mt-6 font-bold">Order status</h2>
          <Bars
            rows={['Order placed', 'Processing', 'Shipped', 'Out for delivery', 'Delivered'].map((label, i) => ({
              label,
              value: inRange.filter((o) => (o.step ?? 0) === i).length,
            }))}
          />
        </section>
      </div>

      <section className="box mt-6 overflow-x-auto">
        <h2 className="p-5 pb-3 font-bold">Product performance</h2>
        <table className="rtable w-full text-left text-sm">
          <thead>
            <tr><th className={th}>Product</th><th className={th}>Units sold</th><th className={th}>Revenue</th><th className={th}>Share</th></tr>
          </thead>
          <tbody>
            {products.slice(0, 10).map((p) => (
              <tr key={p.name} className={rowCls}>
                <td data-label="" className={td}>
                  <div className="flex items-center gap-3">
                    <img className="size-10 rounded-lg object-cover" src={p.image} alt="" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td data-label="Units sold" className={td}>{p.units}</td>
                <td data-label="Revenue" className={td}>{money(p.revenue)}</td>
                <td data-label="Share" className={td}>{revenue ? Math.round((p.revenue / revenue) * 100) : 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length && <p className="p-8 text-center text-slate-500">No sales in this period.</p>}
      </section>
    </>
  )
}
