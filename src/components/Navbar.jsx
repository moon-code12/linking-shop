import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { homeFor } from './RequireAuth'

const link = ({ isActive }) => (isActive ? 'text-brand' : 'hover:text-brand')

// Phone layout: [logo ........ cart] / [search] / [links]. Desktop: logo, search, links, cart in one row.
export default function Navbar() {
  const { count } = useCart()
  const { settings } = useStore()
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const search = (e) => {
    e.preventDefault()
    nav(q ? `/?search=${encodeURIComponent(q)}` : '/')
  }
  return (
    <header className="border-b border-slate-200 bg-white md:sticky md:top-0 md:z-10">
      <div className="wrap flex flex-wrap items-center gap-x-4 gap-y-2 !py-3">
        <Link to="/" className="order-1 flex min-w-0 items-center gap-2 text-xl font-extrabold text-brand md:text-2xl">
          {settings.logo && <img className="size-8 shrink-0 rounded-lg object-contain md:size-9" src={settings.logo} alt="" />}
          <span className="truncate">{settings.storeName}</span>
        </Link>
        <NavLink to="/cart" className={(s) => `order-2 ml-auto whitespace-nowrap font-medium md:order-4 md:ml-0 ${link(s)}`}>
          Cart {count > 0 && <b className="ml-0.5 rounded-full bg-brand px-2 py-0.5 text-xs text-white">{count}</b>}
        </NavLink>
        <form className="order-3 basis-full md:order-2 md:flex-1 md:basis-0" onSubmit={search}>
          <input className="w-full !rounded-full !px-4" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." />
        </form>
        <nav className="order-4 flex basis-full items-center gap-5 text-sm font-medium md:order-3 md:basis-auto md:text-base">
          <NavLink to="/" className={link}>Shop</NavLink>
          <NavLink to="/track" className={link}>Track order</NavLink>
          {user ? (
            <NavLink to={homeFor(user)} className={link}>{user.role === 'admin' ? 'Admin' : 'My store'}</NavLink>
          ) : (
            <NavLink to="/login" className={link}>Seller login</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
