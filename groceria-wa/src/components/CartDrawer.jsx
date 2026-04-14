import { AnimatePresence, motion } from 'framer-motion'
import { X, Trash2 } from 'lucide-react'
import { formatMoney } from '../lib/format'
import { useCart } from '../context/CartContext'

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { lines, setQty, removeLine, subtotal, tax, total } = useCart()

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
            aria-label="Close cart overlay"
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
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-stone-900">
                Your bag
              </h2>
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
              {lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-stone-500">
                  <span className="text-4xl">🛒</span>
                  <p className="mt-3 font-medium">Your bag is empty</p>
                  <p className="mt-1 text-sm">Add fresh picks from the shop.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {lines.map((line, idx) => (
                    <li
                      key={`${line.cat}-${line.productId}`}
                      className="flex gap-3 rounded-2xl border border-orange-50 bg-orange-50/30 p-3"
                    >
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                        {line.img ? (
                          <img
                            src={line.img}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xl">
                            🥬
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-stone-900">
                          {line.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          {formatMoney(line.price)} each
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="inline-flex items-center rounded-full border border-orange-100 bg-white">
                            <button
                              type="button"
                              className="px-2.5 py-1 text-sm font-bold"
                              onClick={() => setQty(idx, line.qty - 1)}
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              className="px-2.5 py-1 text-sm font-bold"
                              onClick={() => setQty(idx, line.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLine(idx)}
                            className="ml-auto rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {lines.length > 0 && (
              <div className="border-t border-orange-100/80 bg-white p-5">
                <div className="space-y-1 text-sm text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>{formatMoney(tax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-orange-50 pt-2 text-base font-bold text-stone-900">
                    <span>Total</span>
                    <span>{formatMoney(total)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCheckout}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-[#1ebe5d]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Checkout via WhatsApp
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
