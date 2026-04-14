import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const KEY = 'groceria_wishlist'

/** @typedef {{ cat: string, productId: string }} WishItem */

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(load)

  const persist = useCallback((next) => {
    setItems(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }, [])

  const has = useCallback(
    (cat, productId) => items.some((i) => i.cat === cat && i.productId === productId),
    [items],
  )

  const toggle = useCallback(
    (cat, productId) => {
      persist(
        has(cat, productId)
          ? items.filter((i) => !(i.cat === cat && i.productId === productId))
          : [{ cat, productId }, ...items],
      )
    },
    [has, items, persist],
  )

  const remove = useCallback(
    (cat, productId) => {
      persist(items.filter((i) => !(i.cat === cat && i.productId === productId)))
    },
    [items, persist],
  )

  const clear = useCallback(() => persist([]), [persist])

  const value = useMemo(
    () => ({ items, has, toggle, remove, clear, count: items.length }),
    [items, has, toggle, remove, clear],
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

