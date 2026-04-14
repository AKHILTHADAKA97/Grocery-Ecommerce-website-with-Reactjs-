import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ImageUp, X } from 'lucide-react'
import { formatMoney } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrdersContext'
import { downloadUpload, storeUpload } from '../utils/uploadStore'

const WA = '9121751697'

function normalizePhone(v) {
  return v.replace(/[^\d]/g, '').slice(0, 12)
}

function makeSafeName(v) {
  return v
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .slice(0, 32)
}

export default function CheckoutModal({ open, onClose, onDone }) {
  const { lines, subtotal, tax, total, setCodSelected, codCharge, clear } = useCart()
  const { placeOrder } = useOrders()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pin, setPin] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [utr, setUtr] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [error, setError] = useState('')
  const [lastSavedScreenshotName, setLastSavedScreenshotName] = useState('')

  const canSend = useMemo(() => {
    if (!name || !phone || !address || !landmark || !city || !state || !pin) return false
    if (pin.replace(/\D/g, '').length !== 6) return false
    if (normalizePhone(phone).length < 10) return false
    if (paymentMethod === 'upi') {
      if (!utr.trim()) return false
      if (!screenshot) return false
    }
    return true
  }, [address, city, landmark, name, paymentMethod, phone, pin, screenshot, state, utr])

  function submit(e) {
    e.preventDefault()
    setError('')
    if (!canSend) {
      setError(
        paymentMethod === 'upi'
          ? 'Please fill all required fields + upload payment screenshot for UPI.'
          : 'Please fill all required fields.',
      )
      return
    }

    const items = lines.map((l) => ({
      id: `${l.cat}-${l.productId}`,
      name: l.name,
      price: l.price,
      qty: l.qty,
      img: l.img,
    }))

    const cleanedPhone = normalizePhone(phone)
    const cleanedPin = pin.replace(/\D/g, '').slice(0, 6)

    let screenshotName = ''
    if (paymentMethod === 'upi' && screenshot) {
      const base = `${makeSafeName(name)}_${cleanedPhone}`
      const ext = screenshot.name?.split('.').pop()?.toLowerCase() || 'png'
      screenshotName = `${base}.${ext}`
      setLastSavedScreenshotName(screenshotName)
    }

    const order = placeOrder({
      customer: {
        name: name.trim(),
        phone: cleanedPhone,
        address: address.trim(),
        landmark: landmark.trim(),
        city: city.trim(),
        state: state.trim(),
        pin: cleanedPin,
      },
      payment: {
        method: paymentMethod,
        ...(paymentMethod === 'upi' ? { utr: utr.trim(), screenshotName } : {}),
      },
      items,
      subtotal,
      tax,
      codCharge: paymentMethod === 'cod' ? codCharge : 0,
      total,
    })

    if (paymentMethod === 'upi' && screenshot && screenshotName) {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = String(reader.result || '')
        try {
          storeUpload({
            filename: screenshotName,
            dataUrl,
            mime: screenshot.type || 'image/png',
            size: screenshot.size || 0,
          })
        } catch {
          // ignore - storage may fail due to size limits
        }
      }
      reader.readAsDataURL(screenshot)
    }

    let linesText = ''
    lines.forEach((l) => {
      const amt = l.price * l.qty
      linesText += `• ${l.name} (x${l.qty}) — ${formatMoney(amt)}\n`
    })

    const payBlock =
      paymentMethod === 'cod'
        ? `💳 *Payment:* COD\n🚚 *Express delivery:* 30 mins (service up to 30 range)\n💵 *COD charge:* ${formatMoney(codCharge)}`
        : `💳 *Payment:* UPI\n🔢 *UTR/Ref:* ${utr.trim()}\n🧾 *Screenshot file:* ${screenshotName || '—'}\n\n⚠️ Attach the screenshot in WhatsApp manually (WhatsApp link can only send text).`

    const msg = `🌿 *NEW ORDER — groceria.*\n\n👤 *Customer:* ${name.trim()}\n📞 *Phone:* ${cleanedPhone}\n📍 *Address:* ${address.trim()}, ${city.trim()}, ${state.trim()} - ${cleanedPin}\n\n${payBlock}\n\n🛒 *Items:*\n${linesText}\n💰 *Subtotal:* ${formatMoney(subtotal)}\n🧾 *Tax:* ${formatMoney(tax)}\n💎 *TOTAL:* ${formatMoney(total)}\n\n🆔 *Order ID:* ${order.id}\n🕒 ${new Date().toLocaleString()}\n✅ Please confirm.`
    const msgWithLandmark = msg.replace(
      '📍 *Address:*',
      `📍 *Address:*\n🧭 *Landmark/Area:* ${landmark.trim()}\n`,
    )

    const url = `https://wa.me/${WA}?text=${encodeURIComponent(msgWithLandmark)}`
    window.open(url, '_blank', 'noopener,noreferrer')

    clear()
    onClose()
    onDone?.('Order saved & WhatsApp opened!')
    setName('')
    setPhone('')
    setAddress('')
    setLandmark('')
    setCity('')
    setState('')
    setPin('')
    setPaymentMethod('cod')
    setCodSelected(false)
    setUtr('')
    setScreenshot(null)
    setError('')
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-orange-100 bg-white px-5 py-4">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                Delivery details
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 hover:bg-orange-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-3 px-5 py-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-stone-600">Full name *</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none ring-0 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-stone-600">Phone *</span>
                  <input
                    required
                    inputMode="numeric"
                    pattern="\\d{10,12}"
                    title="Enter 10-12 digits"
                    value={phone}
                    onChange={(e) => setPhone(normalizePhone(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="text-stone-600">Address *</span>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                />
              </label>
              <label className="block text-sm">
                <span className="text-stone-600">Landmark / Area *</span>
                <input
                  required
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Near temple / opposite school / street name"
                  className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block text-sm sm:col-span-1">
                  <span className="text-stone-600">City *</span>
                  <input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  />
                </label>
                <label className="block text-sm sm:col-span-1">
                  <span className="text-stone-600">State *</span>
                  <input
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  />
                </label>
                <label className="block text-sm sm:col-span-1">
                  <span className="text-stone-600">PIN *</span>
                  <input
                    required
                    inputMode="numeric"
                    pattern="\\d{6}"
                    title="Enter 6-digit pincode"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-stone-600">Payment *</span>
                  <select
                    value={paymentMethod}
                    onChange={(e) => {
                      const v = e.target.value
                      setPaymentMethod(v)
                      setCodSelected(v === 'cod')
                    }}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  >
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="upi">UPI (Online)</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="text-stone-600">
                    Payment code / UTR {paymentMethod === 'upi' ? '*' : '(optional)'}
                  </span>
                  <input
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    required={paymentMethod === 'upi'}
                    placeholder={paymentMethod === 'upi' ? 'Enter UTR/Reference' : '—'}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  />
                </label>
              </div>

              {paymentMethod === 'upi' && (
                <div className="rounded-2xl border border-orange-100 bg-white p-4">
                  <p className="text-sm font-semibold text-stone-900">
                    Upload payment screenshot *
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    We will save it locally as <b>Name_Phone.ext</b>. WhatsApp link
                    can’t attach images automatically — you’ll attach it manually in chat.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/25 hover:bg-orange-600">
                      <ImageUp className="h-4 w-4" />
                      Choose file
                      <input
                        type="file"
                        accept="image/*"
                        required
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] || null
                          setScreenshot(f)
                        }}
                      />
                    </label>
                    <span className="text-xs text-stone-600">
                      {screenshot ? screenshot.name : 'No file selected'}
                    </span>
                  </div>
                  {lastSavedScreenshotName && (
                    <button
                      type="button"
                      onClick={() => downloadUpload(lastSavedScreenshotName)}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-orange-100 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-orange-50"
                    >
                      <Download className="h-4 w-4" />
                      Download saved screenshot
                    </button>
                  )}
                </div>
              )}

              <div className="rounded-2xl bg-orange-50/80 p-4 text-sm text-stone-700">
                <p className="font-semibold text-stone-900">Order summary</p>
                <div className="mt-2 space-y-1">
                  {lines.map((l) => (
                    <div key={`${l.cat}-${l.productId}`} className="flex justify-between gap-2">
                      <span className="truncate">
                        {l.name} ×{l.qty}
                      </span>
                      <span>{formatMoney(l.price * l.qty)}</span>
                    </div>
                  ))}
                </div>
                {paymentMethod === 'cod' && (
                  <div className="mt-2 flex justify-between text-xs font-semibold text-stone-700">
                    <span>COD charge</span>
                    <span>{formatMoney(codCharge)}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-orange-100/80 pt-2 font-bold text-stone-900">
                  <span>Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </div>
              {error && (
                <p className="text-sm font-semibold text-red-600">{error}</p>
              )}
              <div className="flex gap-2 pb-4 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl border border-orange-100 py-3 text-sm font-semibold text-stone-700 hover:bg-orange-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSend}
                  className="flex-1 rounded-2xl bg-[#25D366] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-[#1ebe5d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send order
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
