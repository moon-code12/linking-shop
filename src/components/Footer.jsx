import { useStore } from '../context/StoreContext'

export default function Footer() {
  const { settings: s } = useStore()
  return (
    <footer className="border-t border-slate-200 bg-white text-center">
      <div className="wrap">
        <p><strong>{s.storeName}</strong> – {s.tagline}</p>
        <p className="text-sm text-slate-500">
          {[s.email, s.phone, s.address].filter(Boolean).join(' · ')}
        </p>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} {s.storeName}. Demo store, no real payments.</p>
      </div>
    </footer>
  )
}
