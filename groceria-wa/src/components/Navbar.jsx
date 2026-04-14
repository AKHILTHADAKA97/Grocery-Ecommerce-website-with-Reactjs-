import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { CATEGORIES } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function Navbar({ onOpenCart, onOpenWishlist, onSearch }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const navigate = useNavigate()

  function submitSearch(e) {
    e.preventDefault()
    onSearch?.(q)
  }

  return (
    <>
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 glass-nav"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-100 bg-white text-stone-800 shadow-sm transition hover:border-orange-200 md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-lg shadow-md shadow-orange-500/25">
              🥗
            </span>
            <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-stone-900">
              groceria<span className="text-orange-500">.</span>
            </span>
          </Link>

          <form
            onSubmit={submitSearch}
            className="mx-auto hidden max-w-xl flex-1 md:block"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for grocery, vegetables, spices..."
                className="w-full rounded-full border border-orange-100/80 bg-white py-2.5 pl-11 pr-4 text-sm text-stone-800 shadow-inner shadow-orange-500/5 outline-none ring-0 transition placeholder:text-stone-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="hidden rounded-full border border-orange-100 bg-white px-3 py-2 text-xs font-semibold text-stone-600 shadow-sm transition hover:border-orange-200 md:inline"
            >
              Admin
            </button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={onOpenWishlist}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-white text-stone-800 shadow-sm transition hover:border-orange-200"
              aria-label="Open wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-bold text-white">
                  {wishCount > 99 ? '99+' : wishCount}
                </span>
              )}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCart}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-white text-stone-800 shadow-sm transition hover:border-orange-200"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </motion.button>
          </div>
        </div>

        <form onSubmit={submitSearch} className="border-t border-orange-50 px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search groceries..."
              className="w-full rounded-full border border-orange-100/80 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
            />
          </div>
        </form>

        <nav className="hidden border-t border-orange-50/80 bg-white/50 md:block">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-1 px-4 py-2">
            <Link
              to="/"
              className="rounded-full px-4 py-1.5 text-sm font-semibold text-stone-600 transition hover:bg-orange-50 hover:text-orange-700"
            >
              Home
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/c/${c.id}`}
                className="rounded-full px-4 py-1.5 text-sm font-semibold text-stone-600 transition hover:bg-orange-50 hover:text-orange-700"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="absolute left-0 top-0 flex h-full w-[min(88vw,300px)] flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-orange-100 px-4 py-4">
                <span className="font-[family-name:var(--font-display)] text-lg font-semibold">
                  groceria.
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 hover:bg-orange-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 font-medium text-stone-800 hover:bg-orange-50"
                >
                  Home
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    to={`/c/${c.id}`}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 font-medium text-stone-700 hover:bg-orange-50"
                  >
                    {c.label}
                  </Link>
                ))}
                <Link
                  to="/admin/login"
                  onClick={() => setOpen(false)}
                  className="mt-auto rounded-xl border border-orange-100 px-3 py-3 text-center font-semibold text-orange-700"
                >
                  Admin login
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
