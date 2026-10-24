import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { money } from '../components/ProductCard'
import { Badge, PageHeader, rowCls, td, th } from './ui'

const blank = { name: '', category: '', price: '', oldPrice: '', stock: '', sizes: '', images: '', description: '', active: true }

const toForm = (p) => ({
  name: p.name,
  category: p.category,
  price: String(p.price),
  oldPrice: p.oldPrice ? String(p.oldPrice) : '',
  stock: String(p.stock ?? 0),
  sizes: (p.sizes ?? []).join(', '),
  images: p.images.join('\n'),
  description: p.description,
  active: p.active !== false,
})

const label = 'grid gap-1 text-sm font-medium'

function ProductForm({ product, categories, onSave, onClose }) {
  const [f, setF] = useState(product ? toForm(product) : blank)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const id = product?.id ?? `${f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString(36)}`
    const images = f.images.split('\n').map((s) => s.trim()).filter(Boolean)
    onSave({
      rating: 4.5,
      reviews: 0,
      ...product,
      id,
      name: f.name.trim(),
      category: f.category.trim() || 'General',
      price: Number(f.price),
      oldPrice: f.oldPrice ? Number(f.oldPrice) : undefined,
      stock: Math.max(0, Math.floor(Number(f.stock)) || 0),
      sizes: f.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      images: images.length ? images : [`https://picsum.photos/seed/${id}/800/800`],
      description: f.description.trim(),
      active: f.active,
    })
  }

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto bg-black/50" onClick={onClose}>
      <div className="flex min-h-full items-start justify-center p-3 sm:items-center sm:p-4">
      <form className="box w-full max-w-2xl p-4 sm:p-6" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2 className="mb-4 text-xl font-bold">{product ? 'Edit product' : 'Add product'}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={`${label} sm:col-span-2`}>Name
            <input required value={f.name} onChange={set('name')} />
          </label>
          <label className={label}>Category
            <input required list="cats" value={f.category} onChange={set('category')} />
            <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </label>
          <label className={label}>Stock
            <input required type="number" min="0" step="1" value={f.stock} onChange={set('stock')} />
          </label>
          <label className={label}>Price ($)
            <input required type="number" min="0" step="0.01" value={f.price} onChange={set('price')} />
          </label>
          <label className={label}>Old price ($, optional)
            <input type="number" min="0" step="0.01" value={f.oldPrice} onChange={set('oldPrice')} />
          </label>
          <label className={`${label} sm:col-span-2`}>Sizes (comma separated, optional)
            <input placeholder="S, M, L" value={f.sizes} onChange={set('sizes')} />
          </label>
          <label className={`${label} sm:col-span-2`}>Image URLs (one per line)
            <textarea className="rounded-lg border border-slate-200 px-3 py-2.5" rows={3} value={f.images} onChange={set('images')} placeholder="https://..." />
          </label>
          <label className={`${label} sm:col-span-2`}>Description
            <textarea className="rounded-lg border border-slate-200 px-3 py-2.5" rows={3} value={f.description} onChange={set('description')} />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
            <input type="checkbox" className="size-4" checked={f.active} onChange={set('active')} />
            Published (visible in the storefront)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="rounded-lg border border-slate-200 px-5 py-3 font-semibold" onClick={onClose}>Cancel</button>
          <button className="btn">{product ? 'Save changes' : 'Add product'}</button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default function Products() {
  const { products, saveProduct, deleteProduct } = useStore()
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | product

  const categories = [...new Set(products.map((p) => p.category))]
  const list = products.filter((p) => (p.name + p.category).toLowerCase().includes(q.toLowerCase()))

  const remove = (p) => {
    if (window.confirm(`Delete "${p.name}"? This cannot be undone.`)) deleteProduct(p.id)
  }

  return (
    <>
      <PageHeader title="Products" subtitle={`${products.length} products in your catalogue`}>
        <button className="btn !py-2" onClick={() => setEditing('new')}>+ Add product</button>
      </PageHeader>

      <input className="mb-4 w-full max-w-sm" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />

      <div className="box overflow-x-auto">
        <table className="rtable w-full text-left text-sm">
          <thead>
            <tr><th className={th}>Product</th><th className={th}>Category</th><th className={th}>Price</th><th className={th}>Stock</th><th className={th}>Status</th><th className={th} /></tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className={rowCls}>
                <td data-label="" className={td}>
                  <div className="flex items-center gap-3">
                    <img className="size-12 rounded-lg object-cover" src={p.images[0]} alt="" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td data-label="Category" className={td}>{p.category}</td>
                <td data-label="Price" className={td}>{money(p.price)}</td>
                <td data-label="Stock" className={td}>{p.stock}</td>
                <td data-label="Status" className={td}>
                  <button title="Click to toggle" onClick={() => saveProduct({ ...p, active: p.active === false })}>
                    <Badge label={p.active === false ? 'Hidden' : 'Published'} />
                  </button>
                </td>
                <td data-label="" className={`${td} whitespace-nowrap text-right`}>
                  <button className="mr-4 font-medium text-brand" onClick={() => setEditing(p)}>Edit</button>
                  <button className="font-medium text-red-600" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="p-8 text-center text-slate-500">No products found.</p>}
      </div>

      {editing && (
        <ProductForm
          product={editing === 'new' ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            saveProduct(p)
            setEditing(null)
          }}
        />
      )}
    </>
  )
}
