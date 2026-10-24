import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { money } from '../components/ProductCard'
import { Badge, PageHeader, Stat, orderLabel, rowCls, td, th } from './ui'

export default function Dashboard() {
  const { orders, products, settings, seedDemoOrders } = useStore()
  const live = orders.filter((o) => !o.cancelled)
  const revenue = live.reduce((n, o) => n + o.total, 0)
  const open = live.filter((o) => (o.step ?? 0) < 4).length
  const low = products.filter((p) => p.stock <= settings.lowStockLimit)

  // revenue for each of the last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 864e5)
    const total = live.filter((o) => new Date(o.date).toDateString() === d.toDateString()).reduce((n, o) => n + o.total, 0)
    return { label: d.toLocaleDateString(undefined, { weekday: 'short' }), total }
  })
  const peak = Math.max(...days.map((d) => d.total), 1)

  const sold = {}
  live.forEach((o) => o.lines.forEach((l) => {
    sold[l.id] = { name: l.name, image: l.image, qty: (sold[l.id]?.qty ?? 0) + l.qty }
  }))
  const top = Object.values(sold).sort((a, b) => b.qty - a.qty).slice(0, 5)

  return (
    <>
      <PageHeader title="Dashboard" subtitle={`Welcome back! Here is how ${settings.storeName} is doing.`}>
        {!orders.length && <button className="btn !py-2 text-sm" onClick={seedDemoOrders}>Generate sample orders</button>}
      </PageHeader>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Revenue" value={money(revenue)} hint="Excludes cancelled orders" />
        <Stat label="Orders" value={live.length} hint={`${open} still open`} />
        <Stat label="Products" value={products.length} hint={`${products.filter((p) => p.active !== false).length} published`} />
        <Stat label="Low / out of stock" value={low.length} hint={`Limit: ${settings.lowStockLimit} units`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="box p-5 xl:col-span-2">
          <h2 className="font-bold">Revenue, last 7 days</h2>
          <div className="mt-4 flex h-48 items-end gap-3">
            {days.map((d) => (
              <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-xs text-slate-500">{d.total ? money(d.total).replace('.00', '') : ''}</span>
                <div className="w-full rounded-t-md bg-brand" style={{ height: `${(d.total / peak) * 80}%`, minHeight: d.total ? 4 : 2, opacity: d.total ? 1 : 0.2 }} />
                <span className="text-xs text-slate-500">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="box p-5">
          <h2 className="font-bold">Top sellers</h2>
          {top.length ? (
            <ul className="mt-3 grid gap-3">
              {top.map((t) => (
                <li key={t.name} className="flex items-center gap-3">
                  <img className="size-10 rounded-lg object-cover" src={t.image} alt="" />
                  <span className="flex-1 text-sm">{t.name}</span>
                  <span className="text-sm font-semibold">{t.qty} sold</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No sales yet.</p>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="box overflow-x-auto xl:col-span-2">
          <div className="flex items-center justify-between p-5 pb-3">
            <h2 className="font-bold">Recent orders</h2>
            <Link to="/seller/orders" className="text-sm text-brand">View all</Link>
          </div>
          {orders.length ? (
            <table className="rtable w-full text-left text-sm">
              <thead><tr><th className={th}>Order</th><th className={th}>Customer</th><th className={th}>Total</th><th className={th}>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className={rowCls}>
                    <td data-label="" className={`${td} font-medium`}>{o.id}</td>
                    <td data-label="Customer" className={td}>{o.customer.name}</td>
                    <td data-label="Total" className={td}>{money(o.total)}</td>
                    <td data-label="Status" className={td}><Badge label={orderLabel(o)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-5 pt-0 text-sm text-slate-500">No orders yet. Orders placed in the storefront show up here.</p>
          )}
        </section>

        <section className="box p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Needs restocking</h2>
            <Link to="/seller/inventory" className="text-sm text-brand">Inventory</Link>
          </div>
          {low.length ? (
            <ul className="mt-3 grid gap-3">
              {low.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <img className="size-10 rounded-lg object-cover" src={p.images[0]} alt="" />
                  <span className="flex-1 text-sm">{p.name}</span>
                  <span className={`text-sm font-semibold ${p.stock <= 0 ? 'text-red-600' : 'text-amber-600'}`}>{p.stock} left</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-500">Everything is well stocked.</p>
          )}
        </section>
      </div>
    </>
  )
}
