import { addAdminNotification } from './adminNotifications'
const STORAGE_KEY = 'groceria_notify_requests'

/**
 * @typedef {Object} NotifyRequest
 * @property {string} id
 * @property {string} productId
 * @property {string} productName
 * @property {string} email
 * @property {string} createdAt
 */

/** @returns {NotifyRequest[]} */
export function loadNotifyRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** @param {NotifyRequest[]} rows */
export function saveNotifyRequests(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

/**
 * @param {{ productId: string, productName: string, email: string }} input
 * @returns {NotifyRequest}
 */
export function addNotifyRequest(input) {
  const row = {
    id: `notify_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    productId: input.productId,
    productName: input.productName,
    email: input.email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
  }
  const list = loadNotifyRequests()
  saveNotifyRequests([row, ...list])
  addAdminNotification({
    type: 'notify',
    title: `Stock notify request (${input.productName})`,
    detail: input.email.trim().toLowerCase(),
  })
  return row
}
