import { Link, Navigate, NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'

const items = [
  ['/seller', 'Dashboard', true],
  ['/seller/products', 'Products'],
  ['/seller/orders', 'Orders'],
  ['/seller/inventory', 'Inventory'],
  ['/seller/customers', 'Customers'],
  ['/seller/analytics', 'Analytics'],
  ['/seller/settings', 'Settings'],
]

export default function SellerLayout() {
  const { settings } = useStore()
  const { user, logout } = useAuth()

  // New sellers must finish store setup first.
  if (!user.store) return <Navigate to="/setup" replace />

  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-slate-900 text-slate-300 max-md:sticky max-md:top-0 max-md:z-20 md:flex md:w-60 md:shrink-0 md:flex-col">
        <div className="flex items-center gap-3 px-4 py-3 md:px-5 md:py-4">
          {settings.logo && <img className="size-9 rounded-lg bg-white object-contain" src={settings.logo} alt="" />}
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold text-white">{settings.storeName}</p>
            <p className="text-xs text-slate-400">Seller workspace</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:grid md:overflow-visible md:pb-0">
          {items.map(([to, label, end]) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'hover:bg-slate-800'}`
              }
            >
              {label}
            </NavLink>
          ))}
          {/* the sidebar footer is desktop-only, so phones get these at the end of the menu */}
          <Link to={`/store/${settings.storeSlug}`} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 md:hidden">
            Storefront
          </Link>
          <button className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-800 md:hidden" onClick={logout}>
            Log out
          </button>
        </nav>
        <div className="hidden px-5 py-4 md:mt-auto md:block">
          <Link to={`/store/${settings.storeSlug}`} className="block text-sm text-slate-400 hover:text-white">← View storefront</Link>
          <p className="mt-4 truncate text-sm text-white">{user.name}</p>
          <p className="truncate text-xs text-slate-400">{user.email}</p>
          <button className="mt-2 text-sm text-slate-400 hover:text-white" onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
