import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ORDER_STATUSES, useOrders } from '../context/OrdersContext'
import { formatDayKey, getOrdersForDay } from '../utils/orderStorage'
import { formatMoney, formatTime } from '../lib/format'
import { loadNotifyRequests } from '../utils/notifyStorage'
import { loadAdminNotifications } from '../utils/adminNotifications'

export default function AdminDashboard() {
  const { logout } = useAuth()
  const { ordersByDay, setStatus } = useOrders()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [selected, setSelected] = useState(() => new Date())
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [notifyRows, setNotifyRows] = useState(() => loadNotifyRequests())
  const [notifications, setNotifications] = useState(() => loadAdminNotifications())

  const dayKey = formatDayKey(selected)
  const orders = useMemo(
    () => getOrdersForDay(ordersByDay, dayKey),
    [ordersByDay, dayKey],
  )

  useEffect(() => {
    const pull = () => {
      setNotifyRows(loadNotifyRequests())
      setNotifications(loadAdminNotifications())
    }
    pull()
    const t = window.setInterval(pull, 3000)
    window.addEventListener('storage', pull)
    return () => {
      window.clearInterval(t)
      window.removeEventListener('storage', pull)
    }
  }, [])

  const allOrders = useMemo(
    () => Object.values(ordersByDay).flat().filter(Boolean),
    [ordersByDay],
  )
  const dayStats = useMemo(() => {
    const totalAmount = orders.reduce((s, o) => s + (o.total || 0), 0)
    const codAmount = orders.reduce((s, o) => s + (o.codCharge || 0), 0)
    const paymentAmount = orders
      .filter((o) => o.payment?.method === 'upi')
      .reduce((s, o) => s + (o.total || 0), 0)
    return { totalAmount, codAmount, paymentAmount, count: orders.length }
  }, [orders])
  const monthStats = useMemo(() => {
    const monthKey = format(month, 'yyyy-MM')
    const monthOrders = allOrders.filter((o) => String(o.createdAt).startsWith(monthKey))
    return {
      orderCount: monthOrders.length,
      totalAmount: monthOrders.reduce((s, o) => s + (o.total || 0), 0),
    }
  }, [allOrders, month])
  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month),
      }),
    [month],
  )

  const hasOrder = (d) => {
    const k = formatDayKey(d)
    return Array.isArray(ordersByDay[k]) && ordersByDay[k].length > 0
  }

  const pad = (getDay(startOfMonth(month)) + 6) % 7
  const blanks = Array.from({ length: pad })
  const dayNotifications = useMemo(
    () =>
      notifications.filter((n) => {
        const d = new Date(n.createdAt)
        const k = formatDayKey(d)
        return k === dayKey
      }),
    [notifications, dayKey],
  )

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">
              groceria admin
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
              Orders by day
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              View storefront
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-5 grid max-w-7xl gap-3 px-4 md:grid-cols-3 lg:grid-cols-6 md:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Daily orders</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{dayStats.count}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">COD amount</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatMoney(dayStats.codAmount)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Payment amount</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatMoney(dayStats.paymentAmount)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Daily total</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{formatMoney(dayStats.totalAmount)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Monthly orders</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{monthStats.orderCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Monthly total</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatMoney(monthStats.totalAmount)}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-start md:px-8">
        <motion.aside
          id="admin-calendar-panel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-500/5"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMonth((m) => subMonths(m, 1))}
              className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <p className="text-sm font-bold text-slate-900">
              {format(month, 'MMMM yyyy')}
            </p>
            <button
              type="button"
              onClick={() => setMonth((m) => addMonths(m, 1))}
              className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {blanks.map((_, i) => (
              <span key={`b-${i}`} />
            ))}
            {days.map((d) => {
              const active = isSameDay(d, selected)
              const inMonth = isSameMonth(d, month)
              const dot = hasOrder(d)
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => setSelected(d)}
                  className={`relative flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition ${
                    active
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                      : inMonth
                        ? 'text-slate-800 hover:bg-orange-50'
                        : 'text-slate-300'
                  }`}
                >
                  {format(d, 'd')}
                  {dot && !active && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-orange-500" />
                  )}
                  {dot && active && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-white" />
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Selected:{' '}
            <span className="font-semibold text-slate-800">
              {format(selected, 'EEEE, MMM d, yyyy')}
            </span>
          </p>
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="min-w-0 rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-500/5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Day ledger
              </p>
              <h2 className="text-lg font-semibold text-slate-900">
                {dayKey} · {orders.length} order{orders.length === 1 ? '' : 's'}
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">View</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-slate-100/80 last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatTime(o.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">
                      {o.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {o.customer.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {o.customer.phone}
                    </td>
                    <td className="max-w-[220px] px-4 py-3 text-xs text-slate-600">
                      {o.items.map((i) => `${i.name}×${i.qty}`).join(', ')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      {formatMoney(o.total)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700">
                      <div className="font-semibold uppercase">
                        {o.payment?.method || 'cod'}
                      </div>
                      {o.payment?.method === 'cod' && (
                        <div className="mt-0.5 text-[11px] text-slate-600">
                          COD charge: {formatMoney(o.codCharge || 0)}
                        </div>
                      )}
                      {o.payment?.method === 'upi' && o.payment?.utr && (
                        <div className="mt-0.5 font-mono text-[11px] text-slate-600">
                          {o.payment.utr}
                        </div>
                      )}
                      {o.payment?.method === 'upi' &&
                        o.payment?.screenshotName && (
                          <div className="mt-1 text-[11px] text-slate-500">
                            {o.payment.screenshotName}
                          </div>
                        )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(o)}
                        className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-50"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          setStatus(
                            dayKey,
                            o.id,
                            /** @type {import('../types').OrderStatus} */ (
                              e.target.value
                            ),
                          )
                        }
                        className={`w-full min-w-[140px] rounded-xl border px-2 py-1.5 text-xs font-semibold outline-none ring-0 ${
                          o.status === 'completed'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : o.status === 'uncompleted'
                              ? 'border-amber-200 bg-amber-50 text-amber-900'
                              : 'border-slate-200 bg-white text-slate-800'
                        }`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="px-5 py-16 text-center text-slate-500">
                No orders for this date. Orders appear here after checkout from
                the storefront.
              </div>
            )}
          </div>
        </motion.section>
      </div>

      <div className="mx-auto mt-1 max-w-7xl px-4 pb-8 md:px-8">
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-500/5">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Notify requests</h3>
            <p className="text-xs text-slate-500">
              Upcoming products notification clicks from users
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {notifyRows.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100/80 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatTime(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{r.productName}</td>
                    <td className="px-4 py-3 text-slate-700">{r.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {notifyRows.length === 0 && (
              <div className="px-5 py-12 text-center text-slate-500">
                No notify requests yet.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mx-auto -mt-2 max-w-7xl px-4 pb-8 md:px-8">
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-slate-500/5">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-lg font-semibold text-slate-900">Admin notifications</h3>
            <p className="text-xs text-slate-500">
              New alerts for selected day only
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {dayNotifications.length === 0 && (
              <div className="px-5 py-12 text-center text-slate-500">No notifications yet.</div>
            )}
            {dayNotifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{n.title}</p>
                  <p className="truncate text-xs text-slate-600">{n.detail}</p>
                </div>
                <p className="whitespace-nowrap text-xs text-slate-500">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Customer and order details</h3>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Name</p>
                <p className="font-semibold text-slate-900">{selectedOrder.customer.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Email</p>
                <p className="font-medium text-slate-900">{selectedOrder.customer.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Phone</p>
                <p>{selectedOrder.customer.phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Order date</p>
                <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm">
              <p className="text-xs font-bold uppercase text-slate-400">Address details</p>
              <p className="mt-1 text-slate-800">
                {selectedOrder.customer.address}, {selectedOrder.customer.landmark},{' '}
                {selectedOrder.customer.city}, {selectedOrder.customer.state} -{' '}
                {selectedOrder.customer.pin}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold uppercase text-slate-400">Ordered products</p>
              <div className="mt-2 space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={`${selectedOrder.id}-${item.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.img || 'https://placehold.co/72x72?text=Item'}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg border border-slate-100 object-cover"
                      />
                      <span>
                        {item.name} x{item.qty}
                      </span>
                    </div>
                    <span className="font-semibold">{formatMoney(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm sm:grid-cols-2">
              <p>
                Subtotal: <span className="font-semibold">{formatMoney(selectedOrder.subtotal)}</span>
              </p>
              <p>
                Tax: <span className="font-semibold">{formatMoney(selectedOrder.tax)}</span>
              </p>
              <p>
                COD charge:{' '}
                <span className="font-semibold">{formatMoney(selectedOrder.codCharge || 0)}</span>
              </p>
              <p>
                Total amount:{' '}
                <span className="font-bold text-slate-900">{formatMoney(selectedOrder.total)}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
