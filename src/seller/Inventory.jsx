import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { money } from '../components/ProductCard'
import { Badge, PageHeader, Stat, rowCls, stockLabel, td, th } from './ui'

export default function Inventory() {
  const { products, settings, setStock } = useStore()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const limit = settings.lowStockLimit

  const units = products.reduce((n, p) => n + p.stock, 0)
  const value = products.reduce((n, p) => n + p.stock * p.price, 0)
  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= limit).length
  const outCount = products.filter((p) => p.stock <= 0).length

  const list = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) &&
      (filter === 'All' || stockLabel(p.stock, limit) === filter),
  )

  return (
    <>
      <PageHeader title="Inventory" subtitle={`Products at or below ${limit} units are flagged as low stock.`} />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Total units" value={units} />
        <Stat label="Stock value" value={money(value)} hint="At selling price" />
        <Stat label="Low stock" value={lowCount} />
        <Stat label="Out of stock" value={outCount} />
      </div>

      <div className="mb-4 mt-6 flex flex-wrap items-center gap-3">
        <input className="w-full max-w-sm" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
        {['All', 'In stock', 'Low stock', 'Out of stock'].map((f) => (
          <button key={f} className={`chip ${f === filter ? 'chip-active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="box overflow-x-auto">
        <table className="rtable w-full text-left text-sm">
          <thead>
            <tr><th className={th}>Product</th><th className={th}>Status</th><th className={th}>Value</th><th className={th}>Stock</th><th className={th} /></tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className={rowCls}>
                <td data-label="" className={td}>
                  <div className="flex items-center gap-3">
                    <img className="size-12 rounded-lg object-cover" src={p.images[0]} alt="" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td data-label="Status" className={td}><Badge label={stockLabel(p.stock, limit)} /></td>
                <td data-label="Value" className={td}>{money(p.stock * p.price)}</td>
                <td data-label="Stock" className={td}>
                  <div className="qty">
                    <button onClick={() => setStock(p.id, p.stock - 1)}>−</button>
                    <input
                      className="!w-16 !rounded-none !border-0 !p-0 text-center"
                      type="number"
                      min="0"
                      value={p.stock}
                      onChange={(e) => setStock(p.id, Number(e.target.value))}
                    />
                    <button onClick={() => setStock(p.id, p.stock + 1)}>+</button>
                  </div>
                </td>
                <td data-label="" className={`${td} text-right`}>
                  <button className="font-medium text-brand" onClick={() => setStock(p.id, p.stock + 10)}>+10</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="p-8 text-center text-slate-500">No products match.</p>}
      </div>
    </>
  )
}
