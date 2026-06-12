import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Banknote, CircleAlert, Download, ImageUp, QrCode, X } from 'lucide-react'
import { formatMoney } from '../lib/format'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrdersContext'
import { downloadUpload, storeUpload } from '../utils/uploadStore'

const WA = '9121751697'
const FORM_DRAFT_KEY = 'groceria_checkout_form'
const EMAIL_COOKIE = 'groceria_user_email'
const CUSTOMER_PROFILES_KEY = 'groceria_customer_profiles'

function normalizePhone(v) {
  return v.replace(/[^\d]/g, '').slice(0, 10)
}

function normalizePin(v) {
  return v.replace(/[^\d]/g, '').slice(0, 6)
}

function isValidIndianPhone(v) {
  return /^[6-9]\d{9}$/.test(v)
}

function isValidIndianPin(v) {
  return /^\d{6}$/.test(v)
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

/** @returns {Array<{name:string,email:string,phone:string,address:string,landmark:string,city:string,state:string,pin:string,updatedAt:string}>} */
function loadCustomerProfiles() {
  try {
    const raw = localStorage.getItem(CUSTOMER_PROFILES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** @param {ReturnType<typeof loadCustomerProfiles>} list */
function saveCustomerProfiles(list) {
  localStorage.setItem(CUSTOMER_PROFILES_KEY, JSON.stringify(list.slice(0, 25)))
}

function setCookie(name, value, days = 90) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

function getCookie(name) {
  const token = `${name}=`
  const parts = document.cookie.split(';')
  for (const raw of parts) {
    const item = raw.trim()
    if (item.startsWith(token)) {
      return decodeURIComponent(item.slice(token.length))
    }
  }
  return ''
}

function loadCheckoutDraft() {
  try {
    const raw = localStorage.getItem(FORM_DRAFT_KEY)
    if (!raw) {
      return {
        name: '',
        email: getCookie(EMAIL_COOKIE),
        phone: '',
        address: '',
        landmark: '',
        city: '',
        state: '',
        pin: '',
      }
    }
    const draft = JSON.parse(raw)
    if (!draft || typeof draft !== 'object') throw new Error('invalid draft')
    return {
      name: String(draft.name || ''),
      email: String(draft.email || getCookie(EMAIL_COOKIE) || ''),
      phone: normalizePhone(String(draft.phone || '')),
      address: String(draft.address || ''),
      landmark: String(draft.landmark || ''),
      city: String(draft.city || ''),
      state: String(draft.state || ''),
      pin: normalizePin(String(draft.pin || '')),
    }
  } catch {
    return {
      name: '',
      email: getCookie(EMAIL_COOKIE),
      phone: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pin: '',
    }
  }
}

function makeSafeName(v) {
  return v
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .slice(0, 32)
}

export default function CheckoutModal({ open, onClose, onDone }) {
  const [draft] = useState(loadCheckoutDraft)
  const { lines, subtotal, tax, total, setCodSelected, codCharge, clear } = useCart()
  const { placeOrder } = useOrders()
  const [name, setName] = useState(draft.name)
  const [email, setEmail] = useState(draft.email)
  const [phone, setPhone] = useState(draft.phone)
  const [address, setAddress] = useState(draft.address)
  const [landmark, setLandmark] = useState(draft.landmark)
  const [city, setCity] = useState(draft.city)
  const [state, setState] = useState(draft.state)
  const [pin, setPin] = useState(draft.pin)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [utr, setUtr] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [error, setError] = useState('')
  const [lastSavedScreenshotName, setLastSavedScreenshotName] = useState('')
  const [uploadedAt, setUploadedAt] = useState('')
  const profiles = useMemo(() => loadCustomerProfiles(), [])

  useEffect(() => {
    const draft = { name, email, phone, address, landmark, city, state, pin }
    localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(draft))
    if (email.trim()) setCookie(EMAIL_COOKIE, email.trim())
  }, [address, city, email, landmark, name, phone, pin, state])

  useEffect(() => {
    if (!open) return
    setCodSelected(paymentMethod === 'cod')
  }, [open, paymentMethod, setCodSelected])

  const validationError = useMemo(() => {
    if (!name.trim()) return 'Please enter full name.'
    if (!isValidEmail(email.trim().toLowerCase())) return 'Please enter a valid email address.'
    if (!isValidIndianPhone(normalizePhone(phone))) {
      return 'Please enter valid 10-digit Indian mobile number (example: 9121751697).'
    }
    if (!address.trim()) return 'Please enter delivery address.'
    if (!landmark.trim()) return 'Please enter landmark/area.'
    if (!city.trim()) return 'Please enter city.'
    if (!state.trim()) return 'Please enter state.'
    if (!isValidIndianPin(normalizePin(pin))) return 'Please enter valid 6-digit PIN code.'
    if (paymentMethod === 'upi') {
      if (!utr.trim()) return 'Please enter UTR/transaction reference number.'
      if (!screenshot) return 'Please upload payment screenshot for UPI.'
    }
    return ''
  }, [address, city, email, landmark, name, paymentMethod, phone, pin, screenshot, state, utr])

  const canSend = !validationError

  function applyProfile(profile) {
    if (!profile) return
    setName(String(profile.name || ''))
    setEmail(String(profile.email || ''))
    setPhone(normalizePhone(String(profile.phone || '')))
    setAddress(String(profile.address || ''))
    setLandmark(String(profile.landmark || ''))
    setCity(String(profile.city || ''))
    setState(String(profile.state || ''))
    setPin(normalizePin(String(profile.pin || '')))
  }

  function submit(e) {
    e.preventDefault()
    setError('')
    if (!canSend) return setError(validationError)

    const items = lines.map((l) => ({
      id: `${l.cat}-${l.productId}`,
      name: l.name,
      price: l.price,
      qty: l.qty,
      img: l.img,
    }))

    const cleanedPhone = normalizePhone(phone)
    const cleanedPin = normalizePin(pin)

    let screenshotName = ''
    if (paymentMethod === 'upi' && screenshot) {
      const base = `${makeSafeName(name)}_${cleanedPhone}`
      const ext = screenshot.name?.split('.').pop()?.toLowerCase() || 'png'
      screenshotName = `${base}.${ext}`
      setLastSavedScreenshotName(screenshotName)
    }

    const cleanedEmail = email.trim().toLowerCase()

    const order = placeOrder({
      customer: {
        name: name.trim(),
        email: cleanedEmail,
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

    const profile = {
      name: name.trim(),
      email: cleanedEmail,
      phone: cleanedPhone,
      address: address.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      state: state.trim(),
      pin: cleanedPin,
      updatedAt: new Date().toISOString(),
    }
    const nextProfiles = [
      profile,
      ...profiles.filter((p) => p.phone !== cleanedPhone && p.email !== cleanedEmail),
    ]
    saveCustomerProfiles(nextProfiles)

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

    // Emoji constants - using String.fromCodePoint for guaranteed correct encoding
    const E = {
      bag:   String.fromCodePoint(0x1F6CD, 0xFE0F), // 🛍️
      person:String.fromCodePoint(0x1F464),          // 👤
      email: String.fromCodePoint(0x1F4E7),          // 📧
      phone: String.fromCodePoint(0x1F4DE),          // 📞
      home:  String.fromCodePoint(0x1F3E0),          // 🏠
      pin:   String.fromCodePoint(0x1F4CD),          // 📍
      money: String.fromCodePoint(0x1F4B5),          // 💵
      truck: String.fromCodePoint(0x1F69A),          // 🚚
      card:  String.fromCodePoint(0x1F4B3),          // 💳
      key:   String.fromCodePoint(0x1F511),          // 🔑
      doc:   String.fromCodePoint(0x1F4C4),          // 📄
      clock: String.fromCodePoint(0x1F552),          // 🕒
      warn:  String.fromCodePoint(0x26A0, 0xFE0F),  // ⚠️
      box:   String.fromCodePoint(0x1F4E6),          // 📦
      dot:   String.fromCodePoint(0x1F538),          // 🔸
      cash:  String.fromCodePoint(0x1F4B0),          // 💰
      memo:  String.fromCodePoint(0x1F4DD),          // 📝
      star:  String.fromCodePoint(0x2728),           // ✨
      id:    String.fromCodePoint(0x1F194),          // 🆔
      check: String.fromCodePoint(0x2705),           // ✅
    }

    let linesText = ''

    lines.forEach((l) => {
      const amt = l.price * l.qty
      linesText += `${E.dot} *${l.name}* (x${l.qty}) -> ${formatMoney(amt)}\n`
    })

    const payBlock =
      paymentMethod === 'cod'
        ? `${E.money} *Payment Method:* COD\n${E.truck} *Delivery Charge:* ${formatMoney(codCharge)} (auto between Rs 30-50)`
        : `${E.card} *Payment Method:* UPI\n${E.key} *UTR/Ref:* ${utr.trim()}\n${E.doc} *Screenshot File:* ${screenshotName || '-'}\n${E.clock} *Screenshot Time:* ${uploadedAt || 'Just now'}\n\n${E.warn} *IMPORTANT:* Attach screenshot manually in WhatsApp (link sends text only).`

    const msg = [
      `${E.bag} *NEW ORDER - Groceria* ${E.bag}`,
      ``,
      `${E.person} *Customer:* ${name.trim()}`,
      `${E.email} *Email:* ${cleanedEmail}`,
      `${E.phone} *Phone:* ${cleanedPhone}`,
      `${E.home} *Address:*`,
      `${E.pin} *Landmark/Area:* ${landmark.trim()}`,
      ` ${address.trim()}, ${city.trim()}, ${state.trim()} - ${cleanedPin}`,
      ``,
      payBlock,
      ``,
      `${E.box} *Items:*`,
      linesText,
      `${E.cash} *Subtotal:* ${formatMoney(subtotal)}`,
      `${E.memo} *Tax:* ${formatMoney(tax)}`,
      `${E.star} *TOTAL:* ${formatMoney(total)}`,
      ``,
      `${E.id} *Order ID:* ${order.id}`,
      `${E.clock} *Time:* ${new Date().toLocaleString()}`,
      `${E.check} *Please confirm.*`,
    ].join('\n')

    const url = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener,noreferrer')

    clear()
    onDone?.('Order saved & WhatsApp opened!')
    setPaymentMethod('cod')
    setCodSelected(false)
    setUtr('')
    setScreenshot(null)
    setError('')
    setName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setLandmark('')
    setCity('')
    setState('')
    setPin('')
    setUploadedAt('')
    onClose()
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
            onClick={() => {}}
            aria-label="Close"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="relative z-10 max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
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
                    list="known-customer-names"
                    value={name}
                    onChange={(e) => {
                      const v = e.target.value
                      setName(v)
                      const existing = profiles.find(
                        (p) => p.name.toLowerCase() === v.trim().toLowerCase(),
                      )
                      if (existing) applyProfile(existing)
                    }}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none ring-0 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  />
                  <datalist id="known-customer-names">
                    {profiles.map((p) => (
                      <option key={`name-${p.phone}`} value={p.name} />
                    ))}
                  </datalist>
                </label>
                <label className="block text-sm">
                  <span className="text-stone-600">Email *</span>
                  <input
                    required
                    type="email"
                    list="known-customer-emails"
                    value={email}
                    onChange={(e) => {
                      const v = e.target.value
                      setEmail(v)
                      const existing = profiles.find(
                        (p) => p.email.toLowerCase() === v.trim().toLowerCase(),
                      )
                      if (existing) applyProfile(existing)
                    }}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none ring-0 focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  />
                  <datalist id="known-customer-emails">
                    {profiles.map((p) => (
                      <option key={`email-${p.phone}`} value={p.email} />
                    ))}
                  </datalist>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="text-stone-600">Phone *</span>
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      const cleaned = normalizePhone(e.target.value)
                      setPhone(cleaned)
                      if (cleaned.length === 10) {
                        const existing = profiles.find((p) => p.phone === cleaned)
                        if (existing) applyProfile(existing)
                      }
                    }}
                    className="mt-1 w-full rounded-xl border border-orange-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-500/10"
                  />
                </label>
                <div className="rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-2.5 text-xs text-stone-600">
                  Valid format example: <span className="font-semibold">9121751697</span>
                </div>
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
                    type="tel"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(normalizePin(e.target.value))}
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
              <div className="grid gap-2 sm:grid-cols-2">
                <div
                  className={`rounded-xl border p-3 text-xs ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-orange-100 bg-white'
                  }`}
                >
                  <p className="flex items-center gap-2 font-semibold text-stone-900">
                    <Banknote className="h-4 w-4 text-emerald-700" />
                    Cash on Delivery
                  </p>
                  <p className="mt-1 text-stone-600">
                    Delivery charge auto-calculated between Rs 30-50.
                  </p>
                </div>
                <div
                  className={`rounded-xl border p-3 text-xs ${
                    paymentMethod === 'upi'
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-orange-100 bg-white'
                  }`}
                >
                  <p className="flex items-center gap-2 font-semibold text-stone-900">
                    <QrCode className="h-4 w-4 text-orange-700" />
                    UPI Payment
                  </p>
                  <p className="mt-1 text-stone-600">
                    Add UTR + screenshot, then attach screenshot manually in WhatsApp.
                  </p>
                </div>
              </div>

              {paymentMethod === 'upi' && (
                <div className="rounded-2xl border border-orange-100 bg-white p-4">
                  <div className="mb-4 rounded-2xl border border-orange-100 bg-orange-50/70 p-3">
                    <p className="text-sm font-semibold text-stone-900">Pay to this number</p>
                    <p className="mt-1 font-mono text-base font-bold text-stone-900">{WA}</p>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=${WA}@upi&pn=Groceria&cu=INR`)}`}
                      alt="UPI QR"
                      className="mt-2 h-28 w-28 rounded-lg border border-orange-100 bg-white"
                    />
                  </div>
                  <p className="text-sm font-semibold text-stone-900">
                    Upload payment screenshot *
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    We will save it locally as <b>Name_Phone.ext</b>. WhatsApp link
                    can’t attach images automatically — you’ll attach it manually in chat.
                  </p>
                  <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs font-semibold text-amber-900">
                    <span className="inline-flex items-center gap-1">
                      <CircleAlert className="h-4 w-4" />
                      IMPORTANT: Attach screenshot manually in WhatsApp.
                    </span>
                  </div>
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
                          setUploadedAt(f ? new Date().toLocaleString() : '')
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
                  <>
                    <div className="mt-2 text-xs font-medium text-stone-600">
                      COD delivery charge auto applies between Rs 30-50.
                    </div>
                    <div className="mt-2 flex justify-between text-xs font-semibold text-stone-700">
                      <span>Delivery/COD charge</span>
                      <span>{formatMoney(codCharge)}</span>
                    </div>
                  </>
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
