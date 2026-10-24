import { Fragment, useState } from 'react'
import { ORDER_STEPS, useStore } from '../context/StoreContext'
import { money } from '../components/ProductCard'
import { Badge, PageHeader, orderLabel, rowCls, td, th } from './ui'

export default function Orders() {
  const { orders, updateOrder, cancelOrder, seedDemoOrders } = useStore()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [open, setOpen] = useState(null)

  const list = orders.filter(
    (o) =>
      (status === 'All' || orderLabel(o) === status) &&
      (o.id + o.customer.name + o.customer.email).toLowerCase().includes(q.toLowerCase()),
  )

  const cancel = (o) => {
    if (window.confirm(`Cancel order ${o.id}? Items will be returned to stock.`)) cancelOrder(o.id)
  }

  return (
    <>
      <PageHeader title="Orders" subtitle={`${orders.length} orders in total`}>
        {!orders.length && <button className="btn !py-2 text-sm" onClick={seedDemoOrders}>Generate sample orders</button>}
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-3">
        <input className="w-full max-w-sm" placeholder="Search by order, name or email..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {['All', ...ORDER_STEPS, 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="box overflow-x-auto">
        <table className="rtable w-full text-left text-sm">
          <thead>
            <tr><th className={th}>Order</th><th className={th}>Date</th><th className={th}>Customer</th><th className={th}>Items</th><th className={th}>Total</th><th className={th}>Status</th></tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <Fragment key={o.id}>
                <tr className={`${rowCls} cursor-pointer hover:bg-slate-50`} onClick={() => setOpen(open === o.id ? null : o.id)}>
                  <td data-label="" className={`${td} font-medium`}>{o.id}</td>
                  <td data-label="Date" className={td}>{new Date(o.date).toLocaleDateString()}</td>
                  <td data-label="Customer" className={td}>{o.customer.name}</td>
                  <td data-label="Items" className={td}>{o.lines.reduce((n, l) => n + l.qty, 0)}</td>
                  <td data-label="Total" className={td}>{money(o.total)}</td>
                  <td data-label="Status" className={td}><Badge label={orderLabel(o)} /></td>
                </tr>
                {open === o.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={6} className="rt-full p-5">
                      <div className="grid gap-6 md:grid-cols-3">
                        <div>
                          <h3 className="mb-2 font-bold">Items</h3>
                          {o.lines.map((l) => (
                            <div key={l.id + l.size} className="mb-2 flex items-center gap-3">
                              <img className="size-10 rounded-lg object-cover" src={l.image} alt="" />
                              <span className="flex-1">{l.name}{l.size && ` (${l.size})`} × {l.qty}</span>
                              <span>{money(l.price * l.qty)}</span>
                            </div>
                          ))}
                          <p className="mt-2 text-slate-500">Shipping: {o.shipping ? money(o.shipping) : 'Free'}</p>
                        </div>
                        <div>
                          <h3 className="mb-2 font-bold">Customer</h3>
                          <p>{o.customer.name}</p>
                          <p>{o.customer.email}</p>
                          <p>{o.customer.phone}</p>
                          <p className="mt-2">{o.customer.address}, {o.customer.city} {o.customer.zip}</p>
                          <p className="mt-2 text-slate-500">Payment: {o.customer.method === 'cod' ? 'Cash on delivery' : 'Card'}</p>
                        </div>
                        <div>
                          <h3 className="mb-2 font-bold">Update status</h3>
                          <select
                            className="w-full"
                            disabled={o.cancelled}
                            value={o.step ?? 0}
                            onChange={(e) => updateOrder(o.id, { step: Number(e.target.value) })}
                          >
                            {ORDER_STEPS.map((s, i) => <option key={s} value={i}>{s}</option>)}
                          </select>
                          {!o.cancelled && (
                            <button className="mt-3 text-sm font-medium text-red-600" onClick={() => cancel(o)}>Cancel order</button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="p-8 text-center text-slate-500">No orders found.</p>}
      </div>
    </>
  )
}
