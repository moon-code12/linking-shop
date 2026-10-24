import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { slugify } from '../context/AuthContext'
import { PageHeader } from './ui'

const label = 'grid gap-1 text-sm font-medium'
const section = 'box mb-6 p-6'

export default function Settings() {
  const { settings, setSettings, resetAll } = useStore()
  const [f, setF] = useState({ ...settings })
  const [saved, setSaved] = useState(false)

  const set = (k) => (e) => {
    setSaved(false)
    setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  }

  const save = (e) => {
    e.preventDefault()
    setSettings({
      ...f,
      storeSlug: slugify(f.storeSlug) || 'store',
      shippingFee: Math.max(0, Number(f.shippingFee) || 0),
      freeShippingOver: Math.max(0, Number(f.freeShippingOver) || 0),
      lowStockLimit: Math.max(0, Math.floor(Number(f.lowStockLimit)) || 0),
    })
    setSaved(true)
  }

  const reset = () => {
    if (window.confirm('Reset products, orders and settings to the defaults? This cannot be undone.')) {
      resetAll()
      window.location.reload()
    }
  }

  return (
    <>
      <PageHeader title="Store settings" subtitle="Changes apply to your storefront immediately after saving." />
      <form className="max-w-3xl" onSubmit={save}>
        <fieldset className={section}>
          <legend className="px-2 font-bold">Store details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>Store name
              <input required value={f.storeName} onChange={set('storeName')} />
            </label>
            <label className={label}>Contact email
              <input type="email" value={f.email} onChange={set('email')} />
            </label>
            <label className={`${label} sm:col-span-2`}>Tagline
              <input value={f.tagline} onChange={set('tagline')} />
            </label>
            <label className={`${label} sm:col-span-2`}>Store link
              <div className="flex items-center rounded-lg border border-slate-200 bg-white pl-3 text-sm text-slate-500 focus-within:outline-2 focus-within:outline-brand">
                <span className="whitespace-nowrap">{window.location.origin}/store/</span>
                <input required className="min-w-0 flex-1 !border-0 !outline-0" value={f.storeSlug} onChange={(e) => { setSaved(false); setF({ ...f, storeSlug: slugify(e.target.value) }) }} />
              </div>
            </label>
            <label className={label}>Phone
              <input value={f.phone} onChange={set('phone')} />
            </label>
            <label className={label}>Business address
              <input value={f.address} onChange={set('address')} />
            </label>
          </div>
        </fieldset>

        <fieldset className={section}>
          <legend className="px-2 font-bold">Branding</legend>
          <div className="grid gap-4">
            <label className={label}>Logo image URL
              <input placeholder="https://..." value={f.logo} onChange={set('logo')} />
            </label>
            <label className={label}>Banner image URL
              <input placeholder="https://..." value={f.banner} onChange={set('banner')} />
            </label>
            {(f.logo || f.banner) && (
              <div
                className="flex items-center gap-3 rounded-xl bg-slate-800 bg-cover bg-center p-6 text-white"
                style={f.banner ? { backgroundImage: `linear-gradient(rgba(15,23,42,.6),rgba(15,23,42,.6)), url("${f.banner}")` } : undefined}
              >
                {f.logo && <img className="size-12 rounded-lg bg-white object-contain" src={f.logo} alt="" />}
                <span className="text-xl font-extrabold">{f.storeName}</span>
              </div>
            )}
            <p className="text-xs text-slate-500">Paste a link to an image hosted online. The preview shows how the header banner will look.</p>
          </div>
        </fieldset>

        <fieldset className={section}>
          <legend className="px-2 font-bold">Shipping</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>Shipping fee ($)
              <input type="number" min="0" step="0.01" value={f.shippingFee} onChange={set('shippingFee')} />
            </label>
            <label className={label}>Free shipping over ($)
              <input type="number" min="0" step="1" value={f.freeShippingOver} onChange={set('freeShippingOver')} />
            </label>
          </div>
        </fieldset>

        <fieldset className={section}>
          <legend className="px-2 font-bold">Payments and inventory</legend>
          <div className="grid gap-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" className="size-4" checked={f.acceptCard} disabled={f.acceptCard && !f.acceptCod} onChange={set('acceptCard')} />
              Accept card payments
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" className="size-4" checked={f.acceptCod} disabled={f.acceptCod && !f.acceptCard} onChange={set('acceptCod')} />
              Accept cash on delivery
            </label>
            <label className={`${label} max-w-xs`}>Low stock warning at (units)
              <input type="number" min="0" step="1" value={f.lowStockLimit} onChange={set('lowStockLimit')} />
            </label>
          </div>
        </fieldset>

        <div className="flex items-center gap-4">
          <button className="btn">Save settings</button>
          {saved && <span className="font-medium text-green-600">Saved ✓</span>}
        </div>
      </form>

      <section className="box mt-10 max-w-3xl border-red-200 p-6">
        <h2 className="font-bold text-red-700">Danger zone</h2>
        <p className="my-2 text-sm text-slate-500">Restores the sample products, deletes all orders and resets these settings.</p>
        <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={reset}>
          Reset all store data
        </button>
      </section>
    </>
  )
}
