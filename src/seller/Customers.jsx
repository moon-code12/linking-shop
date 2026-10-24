import { Fragment, useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { money } from '../components/ProductCard'
import { Badge, PageHeader, Stat, orderLabel, rowCls, td, th } from './ui'

export default function Customers() {
  const { orders } = useStore()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)

  // Group orders by customer email. Cancelled orders stay in the history but not in the spend.
  const customers = useMemo(() => {
    const map = {}
    orders.forEach((o) => {
      const key = o.customer.email.toLowerCase()
      const c = (map[key] ??= { email: o.customer.email, name: o.customer.name, phone: o.customer.phone, city: o.customer.city, orders: [] })
      c.orders.push(o)
    })
    return Object.values(map)
      .map((c) => {
        const paid = c.orders.filter((o) => !o.cancelled)
        return { ...c, count: paid.length, spent: paid.reduce((n, o) => n + o.total, 0), last: c.orders[0].date }
      })
      .sort((a, b) => b.spent - a.spent)
  }, [orders])

  const list = customers.filter((c) => (c.name + c.email).toLowerCase().includes(q.toLowerCase()))
  const repeat = customers.filter((c) => c.count > 1).length
  const spent = customers.reduce((n, c) => n + c.spent, 0)

  return (
    <>
      <PageHeader title="Customers" subtitle="Everyone who has ordered from your store." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Customers" value={customers.length} />
        <Stat label="Repeat customers" value={repeat} hint="Ordered more than once" />
        <Stat label="Average spend" value={money(customers.length ? spent / customers.length : 0)} hint="Per customer" />
      </div>

      <input className="mb-4 mt-6 w-full max-w-sm" placeholder="Search by name or email..." value={q} onChange={(e) => setQ(e.target.value)} />

      <div className="box overflow-x-auto">
        <table className="rtable w-full text-left text-sm">
          <thead>
            <tr><th className={th}>Customer</th><th className={th}>Location</th><th className={th}>Orders</th><th className={th}>Total spent</th><th className={th}>Last order</th></tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <Fragment key={c.email}>
                <tr className={`${rowCls} cursor-pointer hover:bg-slate-50`} onClick={() => setOpen(open === c.email ? null : c.email)}>
                  <td data-label="" className={td}>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.email}</p>
                  </td>
                  <td data-label="Location" className={td}>{c.city || '-'}</td>
                  <td data-label="Orders" className={td}>{c.count}</td>
                  <td data-label="Total spent" className={td}>{money(c.spent)}</td>
                  <td data-label="Last order" className={td}>{new Date(c.last).toLocaleDateString()}</td>
                </tr>
                {open === c.email && (
                  <tr className="bg-slate-50">
                    <td colSpan={5} className="rt-full p-5">
                      <p className="mb-3 text-sm text-slate-500">{c.phone || 'No phone number'}</p>
                      <h3 className="mb-2 font-bold">Order history</h3>
                      {c.orders.map((o) => (
                        <div key={o.id} className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-slate-200 py-2">
                          <span className="w-32 font-medium">{o.id}</span>
                          <span className="w-24 text-slate-500">{new Date(o.date).toLocaleDateString()}</span>
                          <span className="flex-1 text-slate-500">{o.lines.map((l) => `${l.name} × ${l.qty}`).join(', ')}</span>
                          <span className="w-20">{money(o.total)}</span>
                          <Badge label={orderLabel(o)} />
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {!list.length && (
          <p className="p-8 text-center text-slate-500">
            {customers.length ? 'No customers match.' : 'No customers yet. They appear here after their first order.'}
          </p>
        )}
      </div>
    </>
  )
}
