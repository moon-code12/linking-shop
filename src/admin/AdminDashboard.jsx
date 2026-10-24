import { Link } from 'react-router-dom'
import { ORDER_STEPS, useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { money } from '../components/ProductCard'
import { Badge, Stat, rowCls, td, th } from '../seller/ui'

export default function AdminDashboard() {
  const { user, accounts, logout, setAccountStatus, deleteAccount } = useAuth()
  const { orders, products } = useStore()

  const sellers = accounts.filter((a) => a.role === 'seller')
  const live = orders.filter((o) => !o.cancelled)
  const revenue = live.reduce((n, o) => n + o.total, 0)

  const remove = (a) => {
    if (window.confirm(`Delete ${a.name}'s account${a.store ? ` and store "${a.store.name}"` : ''}? This cannot be undone.`)) deleteAccount(a.id)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-lg font-extrabold">Platform admin</p>
            <p className="text-xs text-slate-400">Signed in as {user.email}</p>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <Link to="/" className="text-slate-300 hover:text-white">View storefront</Link>
            <button className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold">Platform overview</h1>

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <Stat label="Stores" value={sellers.length} hint={`${sellers.filter((a) => a.status === 'suspended').length} suspended`} />
          <Stat label="Orders" value={live.length} />
          <Stat label="Sales volume" value={money(revenue)} />
          <Stat label="Products listed" value={products.length} />
        </div>

        <section className="box mt-6 overflow-x-auto">
          <h2 className="p-5 pb-3 font-bold">Stores and sellers</h2>
          <table className="rtable w-full text-left text-sm">
            <thead>
              <tr><th className={th}>Seller</th><th className={th}>Store</th><th className={th}>Joined</th><th className={th}>Status</th><th className={th} /></tr>
            </thead>
            <tbody>
              {sellers.map((a) => (
                <tr key={a.id} className={rowCls}>
                  <td data-label="" className={td}>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-slate-500">{a.email}</p>
                  </td>
                  <td data-label="Store" className={td}>
                    {a.store ? (
                      <>
                        <p className="font-medium">{a.store.name}</p>
                        <p className="text-xs text-slate-500">/store/{a.store.slug} · {a.store.type}</p>
                      </>
                    ) : (
                      <span className="text-slate-500">Not set up yet</span>
                    )}
                  </td>
                  <td data-label="Joined" className={td}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td data-label="Status" className={td}><Badge label={a.status === 'suspended' ? 'Suspended' : 'Active'} /></td>
                  <td data-label="" className={`${td} whitespace-nowrap text-right`}>
                    <button
                      className="mr-4 font-medium text-brand"
                      onClick={() => setAccountStatus(a.id, a.status === 'suspended' ? 'active' : 'suspended')}
                    >
                      {a.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                    </button>
                    <button className="font-medium text-red-600" onClick={() => remove(a)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!sellers.length && <p className="p-8 text-center text-slate-500">No sellers have signed up yet.</p>}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="box p-5">
            <h2 className="mb-4 font-bold">Orders by status</h2>
            <div className="grid gap-2">
              {ORDER_STEPS.map((s, i) => (
                <div key={s} className="flex justify-between text-sm">
                  <span>{s}</span>
                  <strong>{live.filter((o) => (o.step ?? 0) === i).length}</strong>
                </div>
              ))}
              <div className="flex justify-between border-t border-slate-100 pt-2 text-sm">
                <span>Cancelled</span>
                <strong>{orders.length - live.length}</strong>
              </div>
            </div>
          </section>
          <section className="box p-5">
            <h2 className="mb-4 font-bold">Recent platform orders</h2>
            {orders.length ? (
              <div className="grid gap-2">
                {orders.slice(0, 6).map((o) => (
                  <div key={o.id} className="flex justify-between text-sm">
                    <span>{o.id} · {o.customer.name}</span>
                    <strong>{money(o.total)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No orders yet.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
