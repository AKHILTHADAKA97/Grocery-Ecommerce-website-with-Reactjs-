import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import CartDrawer from '../components/CartDrawer'
import CheckoutModal from '../components/CheckoutModal'
import Footer from '../components/Footer'
import Toast from '../components/Toast'
import ProductCard from '../components/ProductCard'
import WishlistDrawer from '../components/WishlistDrawer'
import { CATEGORIES, getProductByCategory } from '../data/products'
import { useCart } from '../context/CartContext'

const FILTERS = [
  { id: 'all', label: 'All items' },
  { id: 'sale', label: 'On sale' },
  { id: 'new', label: 'New' },
]

export default function CategoryPage() {
  const { catId } = useParams()
  const navigate = useNavigate()
  const { addLine } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('all')

  const meta = CATEGORIES.find((c) => c.id === catId)
  const products = useMemo(() => getProductByCategory(catId || ''), [catId])

  const filtered = useMemo(() => {
    if (filter === 'sale')
      return products.filter((p) => p.old && p.old > p.price)
    if (filter === 'new')
      return products.filter((p) => /new/i.test(p.badge || ''))
    return products
  }, [products, filter])

  function showToast(msg) {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(''), 2400)
  }

  function onAdd(cat, product) {
    addLine(cat, product)
    showToast(`${product.name} added`)
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-[#fff8f3] px-4 py-20 text-center">
        <p className="text-lg font-semibold text-stone-800">Category not found</p>
        <Link to="/" className="mt-4 inline-block text-orange-600 underline">
          Back home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fff8f3]">
      <AnnouncementBar />
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishOpen(true)}
        onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q.trim())}`)}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <nav className="text-xs text-stone-500">
          <Link to="/" className="hover:text-orange-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-stone-800">{meta.label}</span>
        </nav>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 font-[family-name:var(--font-display)] text-3xl text-stone-900 md:text-4xl"
        >
          {meta.label}
        </motion.h1>
        <p className="mt-2 max-w-xl text-sm text-stone-600">
          Curated for peak freshness — tap add, checkout on WhatsApp.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                filter === f.id
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'border border-orange-100 bg-white text-stone-700 hover:border-orange-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard
              key={p.id}
              cat={catId}
              product={p}
              onAdd={onAdd}
              index={i}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-stone-500">No items in this filter.</p>
        )}
      </div>
      <Footer />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }}
      />
      <WishlistDrawer open={wishOpen} onClose={() => setWishOpen(false)} />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onDone={showToast}
      />
      <Toast message={toast} />
    </div>
  )
}
