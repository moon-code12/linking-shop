import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { slugify, useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import AuthCard from '../components/AuthCard'

const TYPES = ['Fashion', 'Electronics', 'Home & living', 'Beauty', 'Sports', 'Food & drinks', 'Other']

export default function StoreSetup() {
  const { user, saveStore } = useAuth()
  const { setSettings } = useStore()
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', slug: '', type: TYPES[0], description: '', phone: '', city: '' })
  const [slugEdited, setSlugEdited] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const onName = (e) => setF({ ...f, name: e.target.value, slug: slugEdited ? f.slug : slugify(e.target.value) })

  const submit = async (e) => {
    e.preventDefault()
    const slug = slugify(f.slug) || slugify(f.name)
    try {
      await saveStore({ ...f, slug })
    } catch (err) {
      setError(err.code === 'permission-denied' ? 'Permission denied. Check your Firestore security rules.' : err.message)
      return
    }
    // The demo has a single storefront, so setup configures it directly.
    setSettings({
      storeName: f.name.trim(),
      storeSlug: slug,
      phone: f.phone,
      address: f.city,
      ...(f.description.trim() && { tagline: f.description.trim() }),
    })
    nav('/seller', { replace: true })
  }

  return (
    <AuthCard title="Set up your store" subtitle={`Hi ${user.name.split(' ')[0]}, tell us about your business.`}>
      <form className="grid gap-4" onSubmit={submit}>
        <label className="grid gap-1 text-sm font-medium">Store name
          <input required value={f.name} onChange={onName} placeholder="e.g. Amina's Boutique" />
        </label>
        <label className="grid gap-1 text-sm font-medium">Store link
          <div className="flex items-center rounded-lg border border-slate-200 bg-white pl-3 text-sm text-slate-500 focus-within:outline-2 focus-within:outline-brand">
            <span className="whitespace-nowrap">/store/</span>
            <input
              required
              className="min-w-0 flex-1 !border-0 !outline-0"
              value={f.slug}
              onChange={(e) => { setSlugEdited(true); setF({ ...f, slug: slugify(e.target.value) }) }}
            />
          </div>
        </label>
        <label className="grid gap-1 text-sm font-medium">What do you sell?
          <select value={f.type} onChange={set('type')}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label className="grid gap-1 text-sm font-medium">Short description
          <input value={f.description} onChange={set('description')} placeholder="One line about your store" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-medium">Phone
            <input value={f.phone} onChange={set('phone')} />
          </label>
          <label className="grid gap-1 text-sm font-medium">City / country
            <input value={f.city} onChange={set('city')} />
          </label>
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="btn">Create my store</button>
      </form>
    </AuthCard>
  )
}
