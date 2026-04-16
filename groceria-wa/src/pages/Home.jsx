import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import ProductCarousel from '../components/ProductCarousel'
import CategoryGrid from '../components/CategoryGrid'
import CartDrawer from '../components/CartDrawer'
import CheckoutModal from '../components/CheckoutModal'
import Footer from '../components/Footer'
import Toast from '../components/Toast'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { UPCOMING_ITEMS, findProduct } from '../data/products'
import { formatMoney } from '../lib/format'
import WishlistDrawer from '../components/WishlistDrawer'
import { addNotifyRequest } from '../utils/notifyStorage'

const EMAIL_COOKIE = 'groceria_user_email'

function getCookie(name) {
  const token = `${name}=`
  const parts = document.cookie.split(';')
  for (const raw of parts) {
    const item = raw.trim()
    if (item.startsWith(token)) return decodeURIComponent(item.slice(token.length))
  }
  return ''
}

function setCookie(name, value, days = 90) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

function DealTimer() {
  const [left, setLeft] = useState(() => 11 * 3600 + 44 * 60 + 30)

  useEffect(() => {
    const t = setInterval(() => {
      setLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const h = String(Math.floor(left / 3600)).padStart(2, '0')
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, '0')
  const s = String(left % 60).padStart(2, '0')

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid gap-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-6 text-white shadow-xl md:grid-cols-2 md:p-10"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-300/90">
            Limited window
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl">
            Deal of the day
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/75">
            Flash savings on seasonal crates — while supplies last.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              ['Hrs', h],
              ['Min', m],
              ['Sec', s],
            ].map(([lab, val]) => (
              <div
                key={lab}
                className="min-w-[72px] rounded-2xl bg-white/10 px-4 py-3 text-center backdrop-blur"
              >
                <div className="text-2xl font-extrabold tabular-nums">{val}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-white/60">
                  {lab}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-orange-200">Bundle offer</p>
            <p className="mt-1 text-lg font-bold">Farm box + free herbs</p>
            <p className="mt-2 text-sm text-white/70">
              Add any 3 vegetables and unlock herbs at checkout messaging.
            </p>
            <button
              type="button"
              onClick={() =>
                document.getElementById('fresh-aisle')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
              className="mt-4 w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
            >
              Grab deal
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { addLine } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyProduct, setNotifyProduct] = useState(null)

  function showToast(msg) {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(''), 2400)
  }

  function onAdd(cat, product) {
    addLine(cat, product)
    showToast(`${product.name} added to your bag`)
  }

  function onSearch(q) {
    const term = q.trim()
    if (term.length < 2) return
    navigate(`/search?q=${encodeURIComponent(term)}`)
  }

  function handleNotifyClick(item) {
    const cookieEmail = getCookie(EMAIL_COOKIE)
    if (cookieEmail) {
      addNotifyRequest({
        productId: item.id,
        productName: item.name,
        email: cookieEmail,
      })
      showToast(`Notify added for ${item.name}. We will msg shortly if stock update.`)
      return
    }
    setNotifyProduct(item)
    setNotifyEmail('')
    setNotifyOpen(true)
  }

  function submitNotifyRequest() {
    const email = notifyEmail.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !notifyProduct) return
    setCookie(EMAIL_COOKIE, email)
    addNotifyRequest({
      productId: notifyProduct.id,
      productName: notifyProduct.name,
      email,
    })
    setNotifyOpen(false)
    setNotifyProduct(null)
    setNotifyEmail('')
    showToast('Successfully added. We will msg shortly if stock update.')
  }

  const spotlight = useMemo(() => {
    const picks = [
      findProduct('vegetables', 'v2'),
      findProduct('fruits', 'f2'),
      findProduct('dairy', 'd2'),
      findProduct('grains', 'g1'),
      findProduct('spices', 's1'),
    ].filter(Boolean)
    return picks.slice(0, 5)
  }, [])

  const spotlightCats = useMemo(
    () => ({
      v2: 'vegetables',
      f2: 'fruits',
      d2: 'dairy',
      g1: 'grains',
      s1: 'spices',
    }),
    [],
  )

  return (
    <div className="min-h-screen bg-[#fff8f3]">
      <AnnouncementBar />
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishOpen(true)}
        onSearch={onSearch}
      />
      <HeroSection />
      <div id="fresh-aisle">
        <ProductCarousel onAdd={onAdd} />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-start justify-between gap-4 rounded-[2rem] bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white shadow-xl shadow-orange-500/25 md:flex-row md:items-center md:p-8"
        >
          <div>
            <p className="text-sm font-bold">Use code on WhatsApp</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold">
              GROCERIA15 — extra 15% off first order
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-orange-600 shadow-md transition hover:shadow-lg"
          >
            Open bag
          </button>
        </motion.div>
      </div>
      <CategoryGrid />
      <DealTimer />
      {spotlight.length > 0 && (
        <section className="px-4 py-10 md:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-stone-900 md:text-3xl">
              Spotlight
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {spotlight.map((p, i) => (
                <ProductCard
                  key={p.id}
                  cat={spotlightCats[p.id] || 'vegetables'}
                  product={p}
                  onAdd={onAdd}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 pb-10 md:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Coming soon
          </p>
          <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-stone-900 md:text-3xl">
            Upcoming items
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {UPCOMING_ITEMS.map((u) => (
              <div
                key={u.id}
                className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] bg-orange-50">
                  <img
                    src={u.img}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-stone-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Upcoming
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-stone-900">{u.name}</p>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-lg font-extrabold text-stone-900">
                        {formatMoney(u.price)}
                      </p>
                      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">
                        ETA: {u.eta}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotifyClick(u)}
                      className="rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold text-orange-700 transition hover:bg-orange-50"
                      title="Notify when available"
                    >
                      Notify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {notifyOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-lg font-bold text-stone-900">Enter your email</p>
            <p className="mt-1 text-sm text-stone-600">
              {notifyProduct ? `Notify for ${notifyProduct.name}` : 'Notify me'}
            </p>
            <input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-3 w-full rounded-xl border border-orange-100 px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setNotifyOpen(false)
                  setNotifyProduct(null)
                  setNotifyEmail('')
                }}
                className="flex-1 rounded-xl border border-orange-100 py-2.5 text-sm font-semibold text-stone-700 hover:bg-orange-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={submitNotifyRequest}
                className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

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
