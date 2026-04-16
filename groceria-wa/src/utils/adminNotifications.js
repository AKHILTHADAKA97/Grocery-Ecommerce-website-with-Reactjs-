const STORAGE_KEY = 'groceria_admin_notifications'

/**
 * @typedef {Object} AdminNotification
 * @property {string} id
 * @property {'order' | 'notify'} type
 * @property {string} title
 * @property {string} detail
 * @property {string} createdAt
 */

/** @returns {AdminNotification[]} */
export function loadAdminNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** @param {AdminNotification[]} rows */
function saveAdminNotifications(rows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows))
}

/**
 * @param {{ type: 'order' | 'notify', title: string, detail: string }} input
 * @returns {AdminNotification}
 */
export function addAdminNotification(input) {
  const row = {
    id: `note_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    type: input.type,
    title: input.title,
    detail: input.detail,
    createdAt: new Date().toISOString(),
  }
  const list = loadAdminNotifications()
  saveAdminNotifications([row, ...list])
  return row
}
