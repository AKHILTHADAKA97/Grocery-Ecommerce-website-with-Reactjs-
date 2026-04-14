import { useMemo, useState } from 'react'
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
import { ChevronLeft, ChevronRight, Download, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ORDER_STATUSES, useOrders } from '../context/OrdersContext'
import { formatDayKey, getOrdersForDay } from '../utils/orderStorage'
import { formatMoney, formatTime } from '../lib/format'

export default function AdminDashboard() {
  const { logout } = useAuth()
  const { ordersByDay, setStatus } = useOrders()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [selected, setSelected] = useState(() => new Date())

  const dayKey = formatDayKey(selected)
  const orders = useMemo(
    () => getOrdersForDay(ordersByDay, dayKey),
    [ordersByDay, dayKey],
  )

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

  function downloadDayJson() {
    const blob = new Blob(
      [JSON.stringify({ date: dayKey, orders }, null, 2)],
      { type: 'application/json' },
    )
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `groceria-orders-${dayKey}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const pad = (getDay(startOfMonth(month)) + 6) % 7
  const blanks = Array.from({ length: pad })

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

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-start md:px-8">
        <motion.aside
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
          <button
            type="button"
            onClick={downloadDayJson}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            Export day JSON
          </button>
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
    </div>
  )
}
