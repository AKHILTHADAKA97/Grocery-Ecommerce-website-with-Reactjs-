import { AnimatePresence, motion } from 'framer-motion'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { findProduct } from '../data/products'
import { formatMoney } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function WishlistDrawer({ open, onClose }) {
  const { items, remove, clear } = useWishlist()
  const { addLine } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/35 backdrop-blur-[2px]"
            aria-label="Close wishlist overlay"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed right-0 top-0 z-[90] flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-orange-600" />
                <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-stone-900">
                  Liked items
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 hover:bg-orange-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-stone-500">
                  <span className="text-4xl">💛</span>
                  <p className="mt-3 font-medium">No liked items yet</p>
                  <p className="mt-1 text-sm">
                    Tap the heart on a product to save it.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((w) => {
                    const p = findProduct(w.cat, w.productId)
                    if (!p) return null
                    return (
                      <li
                        key={`${w.cat}-${w.productId}`}
                        className="flex gap-3 rounded-2xl border border-orange-50 bg-orange-50/30 p-3"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                          <img
                            src={p.img}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-stone-900">
                            {p.name}
                          </p>
                          <p className="text-xs text-stone-500">{p.desc}</p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-stone-900">
                              {formatMoney(p.price)}
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  addLine(w.cat, p)
                                  remove(w.cat, w.productId)
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-3 py-2 text-xs font-bold text-white hover:bg-stone-800"
                              >
                                <ShoppingBag className="h-4 w-4" />
                                Move to cart
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(w.cat, w.productId)}
                                className="rounded-xl border border-orange-100 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-orange-50"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-orange-100/80 bg-white p-5">
                <button
                  type="button"
                  onClick={clear}
                  className="w-full rounded-2xl border border-orange-100 py-3 text-sm font-semibold text-stone-700 hover:bg-orange-50"
                >
                  Clear liked items
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

