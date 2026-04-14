import { useMemo, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import CartDrawer from '../components/CartDrawer'
import CheckoutModal from '../components/CheckoutModal'
import Footer from '../components/Footer'
import Toast from '../components/Toast'
import ProductCard from '../components/ProductCard'
import WishlistDrawer from '../components/WishlistDrawer'
import { searchProducts } from '../data/products'
import { useCart } from '../context/CartContext'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const navigate = useNavigate()
  const { addLine } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState('')

  const results = useMemo(() => searchProducts(q), [q])

  function showToast(msg) {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(''), 2400)
  }

  return (
    <div className="min-h-screen bg-[#fff8f3]">
      <AnnouncementBar />
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishOpen(true)}
        onSearch={(term) =>
          navigate(`/search?q=${encodeURIComponent(term.trim())}`)
        }
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <Link to="/" className="text-sm font-semibold text-orange-600 hover:underline">
          ← Back
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-stone-900">
          Search results
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Query: <span className="font-semibold text-stone-800">{q || '—'}</span>
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {results.map(({ cat, product }, i) => (
            <ProductCard
              key={`${cat}-${product.id}`}
              cat={cat}
              product={product}
              index={i}
              onAdd={(c, p) => {
                addLine(c, p)
                showToast(`${p.name} added`)
              }}
            />
          ))}
        </div>
        {q.length >= 2 && results.length === 0 && (
          <p className="py-16 text-center text-stone-500">No products matched.</p>
        )}
        {q.length < 2 && (
          <p className="py-16 text-center text-stone-500">
            Type at least 2 characters to search.
          </p>
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
