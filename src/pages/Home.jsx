import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const { products: all, settings } = useStore()
  const products = all.filter((p) => p.active !== false)
  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))]

  const [params] = useSearchParams()
  const search = (params.get('search') || '').toLowerCase()
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('featured')

  let list = products.filter(
    (p) => (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(search),
  )
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)

  const showHero = !search && cat === 'All'

  return (
    <>
      {showHero && (
        <section
          className={settings.banner ? 'bg-cover bg-center text-white' : 'bg-gradient-to-br from-indigo-50 to-pink-50'}
          style={settings.banner ? { backgroundImage: `linear-gradient(rgba(15,23,42,.6),rgba(15,23,42,.6)), url("${settings.banner}")` } : undefined}
        >
          <div className="wrap grid items-center gap-6 !py-8 md:grid-cols-2 md:gap-8 md:!py-12">
            <div>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">Welcome to {settings.storeName}</h1>
              <p className={`my-4 ${settings.banner ? 'text-slate-200' : 'text-slate-500'}`}>
                {settings.tagline} Free shipping over ${settings.freeShippingOver}.
              </p>
              <a href="#products" className="btn">Shop now</a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {products.slice(0, 4).map((p) => (
                <img key={p.id} className="aspect-square w-full rounded-2xl object-cover" src={p.images[1] ?? p.images[0]} alt="" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wrap" id="products">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} className={`chip ${c === cat ? 'chip-active' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
        {search && <p className="mb-3 text-sm text-slate-500">Results for "{search}"</p>}
        {list.length ? (
          <div className="product-grid">
            {list.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <p className="empty">No products found.</p>
        )}
      </section>
    </>
  )
}
