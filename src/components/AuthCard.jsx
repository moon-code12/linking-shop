import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function AuthCard({ title, subtitle, children, footer }) {
  const { settings } = useStore()
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-50 to-pink-50 p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 block text-center text-3xl font-extrabold text-brand">{settings.storeName}</Link>
        <div className="box p-5 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mb-6 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">{footer}</p>
      </div>
    </div>
  )
}
