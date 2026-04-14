import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HelpCircle, Info, ShoppingBag, Sparkles, X } from 'lucide-react'

function useOneTimeHint(key) {
  const [show, setShow] = useState(() => {
    try {
      return localStorage.getItem(key) !== '1'
    } catch {
      return true
    }
  })

  function close() {
    try {
      localStorage.setItem(key, '1')
    } catch {
      // ignore
    }
    setShow(false)
  }

  return { show, close, setShow }
}

export default function HelpFab() {
  // “IP based” isn’t reliable in a pure frontend without a backend;
  // we use per-device storage key (still achieves “one-time” UX).
  const hint = useOneTimeHint('groceria_help_seen_v1')
  const [open, setOpen] = useState(false)

  const items = useMemo(
    () => [
      {
        icon: <ShoppingBag className="h-4 w-4" />,
        title: 'Add to bag',
        desc: 'Tap + on any product card to add it.',
      },
      {
        icon: <Sparkles className="h-4 w-4" />,
        title: 'Checkout',
        desc: 'Bag → WhatsApp checkout. Orders save day-wise (JSON).',
      },
      {
        icon: <Info className="h-4 w-4" />,
        title: 'Admin',
        desc: 'Admin → Calendar left, orders right. Update status dropdown.',
      },
    ],
    [],
  )

  return (
    <>
      <div className="fixed bottom-6 right-5 z-[130] flex items-end gap-2">
        <AnimatePresence>
          {hint.show && !open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="max-w-[260px] rounded-2xl border border-orange-100 bg-white p-3 text-xs text-stone-700 shadow-xl"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-stone-900">
                    Need a quick tour?
                  </p>
                  <p className="mt-1 text-stone-500">
                    Click the help icon to see tips.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={hint.close}
                  className="rounded-lg p-1 hover:bg-orange-50"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setOpen((v) => !v)
            if (hint.show) hint.close()
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg shadow-black/20 hover:bg-stone-800"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[125]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
              aria-label="Close help"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="absolute bottom-6 right-5 w-[min(92vw,380px)] overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-orange-100 px-4 py-3">
                <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-stone-900">
                  Quick tips
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 hover:bg-orange-50"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-2 p-4">
                {items.map((it) => (
                  <div
                    key={it.title}
                    className="flex gap-3 rounded-2xl border border-orange-50 bg-orange-50/30 p-3"
                  >
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-orange-600 ring-1 ring-orange-100">
                      {it.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-900">
                        {it.title}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-600">{it.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

