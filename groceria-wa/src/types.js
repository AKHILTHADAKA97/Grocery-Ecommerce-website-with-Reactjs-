/**
 * @typedef {'pending' | 'completed' | 'uncompleted'} OrderStatus
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} qty
 * @property {string} [img]
 */

/**
 * @typedef {Object} CustomerInfo
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {string} landmark
 * @property {string} city
 * @property {string} state
 * @property {string} pin
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} createdAt
 * @property {CustomerInfo} customer
 * @property {{ method: 'cod' | 'upi', utr?: string, screenshotName?: string }} payment
 * @property {OrderItem[]} items
 * @property {number} subtotal
 * @property {number} tax
 * @property {number} [codCharge]
 * @property {number} total
 * @property {OrderStatus} status
 */

export {}
