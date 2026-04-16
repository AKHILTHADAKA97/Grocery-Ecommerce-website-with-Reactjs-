import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  addOrderToMap,
  loadOrdersMap,
  nextOrderId,
  saveOrdersMap,
  updateOrderStatusInMap,
} from '../utils/orderStorage'
import { addAdminNotification } from '../utils/adminNotifications'

export const ORDER_STATUSES = /** @type {const} */ ([
  'pending',
  'completed',
  'uncompleted',
])

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const [ordersByDay, setOrdersByDay] = useState(loadOrdersMap)

  const placeOrder = useCallback((payload) => {
    const order = {
      id: nextOrderId(),
      createdAt: new Date().toISOString(),
      status: /** @type {import('../types').OrderStatus} */ ('pending'),
      ...payload,
    }
    setOrdersByDay((prev) => {
      const next = addOrderToMap(prev, order)
      saveOrdersMap(next)
      return next
    })
    addAdminNotification({
      type: 'order',
      title: `New order ${order.id}`,
      detail: `${order.customer?.name || 'Customer'} • ${order.payment?.method?.toUpperCase() || 'COD'} • ${order.total}`,
    })
    return order
  }, [])

  const setStatus = useCallback((dayKey, orderId, status) => {
    setOrdersByDay((prev) => {
      const next = updateOrderStatusInMap(prev, dayKey, orderId, status)
      saveOrdersMap(next)
      return next
    })
  }, [])

  const reload = useCallback(() => setOrdersByDay(loadOrdersMap()), [])

  const value = useMemo(
    () => ({ ordersByDay, placeOrder, setStatus, reload }),
    [ordersByDay, placeOrder, setStatus, reload],
  )

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
