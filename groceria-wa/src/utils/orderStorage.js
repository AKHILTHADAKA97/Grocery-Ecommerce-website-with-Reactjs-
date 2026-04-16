const STORAGE_KEY = 'groceria_orders_by_day'
const ORDER_SEQ_KEY = 'groceria_order_seq'

/** @returns {Record<string, import('../types').Order[]>} */
export function loadOrdersMap() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

/** @param {Record<string, import('../types').Order[]>} map */
export function saveOrdersMap(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

/** @param {Date | string} date */
export function formatDayKey(date) {
  const d = date instanceof Date ? date : new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** @param {string} iso */
export function dayKeyFromIso(iso) {
  return formatDayKey(new Date(iso))
}

/**
 * @param {Record<string, import('../types').Order[]>} map
 * @param {string} dayKey
 */
export function getOrdersForDay(map, dayKey) {
  const list = map[dayKey]
  return Array.isArray(list) ? [...list] : []
}

/**
 * @param {Record<string, import('../types').Order[]>} map
 * @param {import('../types').Order} order
 */
export function addOrderToMap(map, order) {
  const key = dayKeyFromIso(order.createdAt)
  const next = { ...map }
  const existing = next[key] ? [...next[key]] : []
  next[key] = [order, ...existing]
  return next
}

/**
 * @param {Record<string, import('../types').Order[]>} map
 * @param {string} dayKey
 * @param {string} orderId
 * @param {import('../types').OrderStatus} status
 */
export function updateOrderStatusInMap(map, dayKey, orderId, status) {
  const next = { ...map }
  const list = next[dayKey]
  if (!Array.isArray(list)) return map
  next[dayKey] = list.map((o) =>
    o.id === orderId ? { ...o, status } : o,
  )
  return next
}

/** @param {Record<string, import('../types').Order[]>} map */
export function daysWithOrders(map) {
  return Object.keys(map).filter((k) => Array.isArray(map[k]) && map[k].length > 0)
}

/** @returns {string} */
export function nextOrderId() {
  try {
    const curr = Number(localStorage.getItem(ORDER_SEQ_KEY) || '0') || 0
    const next = curr + 1
    localStorage.setItem(ORDER_SEQ_KEY, String(next))
    return `groceria._${next}`
  } catch {
    return `groceria._${Date.now()}`
  }
}
