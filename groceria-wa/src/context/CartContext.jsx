import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const CART_KEY = 'groceria_cart'
export const COD_CHARGE_MIN_INR = 30
export const COD_CHARGE_MAX_INR = 50

/** @typedef {{ cat: string, productId: string, name: string, price: number, img?: string, qty: number }} CartLine */

const CartContext = createContext(null)

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const p = JSON.parse(raw)
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

/** @param {number} itemCount */
function getCodCharge(itemCount) {
  if (itemCount <= 0) return 0
  const span = COD_CHARGE_MAX_INR - COD_CHARGE_MIN_INR + 1
  return COD_CHARGE_MIN_INR + ((itemCount * 7) % span)
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(loadCart)
  const [codSelected, setCodSelected] = useState(false)

  const persist = useCallback((next) => {
    setLines(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
  }, [])

  const addLine = useCallback(
    (cat, product) => {
      setLines((prev) => {
        const idx = prev.findIndex(
          (l) => l.cat === cat && l.productId === product.id,
        )
        let next
        if (idx >= 0) {
          next = [...prev]
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
        } else {
          next = [
            ...prev,
            {
              cat,
              productId: product.id,
              name: product.name,
              price: product.price,
              img: product.img,
              qty: 1,
            },
          ]
        }
        localStorage.setItem(CART_KEY, JSON.stringify(next))
        return next
      })
    },
    [],
  )

  const setQty = useCallback((index, qty) => {
    setLines((prev) => {
      if (qty < 1) {
        const next = prev.filter((_, i) => i !== index)
        localStorage.setItem(CART_KEY, JSON.stringify(next))
        return next
      }
      const next = [...prev]
      next[index] = { ...next[index], qty }
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeLine = useCallback((index) => {
    setLines((prev) => {
      const next = prev.filter((_, i) => i !== index)
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(() => {
    persist([])
  }, [persist])

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.price * l.qty, 0),
    [lines],
  )
  const count = useMemo(
    () => lines.reduce((s, l) => s + l.qty, 0),
    [lines],
  )
  const codCharge = useMemo(
    () => (codSelected ? getCodCharge(count) : 0),
    [codSelected, count],
  )
  const tax = useMemo(() => Math.round(subtotal * 0.05 * 100) / 100, [subtotal])
  const total = useMemo(() => subtotal + tax + codCharge, [subtotal, tax, codCharge])

  const value = useMemo(
    () => ({
      lines,
      addLine,
      setQty,
      removeLine,
      clear,
      subtotal,
      tax,
      codSelected,
      setCodSelected,
      codCharge,
      total,
      count,
    }),
    [
      lines,
      addLine,
      setQty,
      removeLine,
      clear,
      subtotal,
      tax,
      codSelected,
      setCodSelected,
      codCharge,
      total,
      count,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
