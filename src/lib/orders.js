const ORDERS_KEY = 'wb_orders'

function getAllOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    return Array.isArray(orders) ? orders : []
  } catch {
    return []
  }
}

function saveAllOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export function getOrdersForCustomer(email) {
  const cleanEmail = (email || '').trim().toLowerCase()
  return getAllOrders()
    .filter((o) => o.customerEmail === cleanEmail)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export function createOrder({ customerEmail, customerName, items, payment }) {
  const orders = getAllOrders()
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  const order = {
    id: `o_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    code: `WB-${1000 + orders.length}`,
    customerEmail: (customerEmail || '').trim().toLowerCase(),
    customerName,
    items,
    total,
    payment,
    status: 'Processing',
    createdAt: Date.now(),
  }

  saveAllOrders([order, ...orders])
  return order
}

export const ORDER_STAGES = ['Processing', 'In Transit', 'Delivered']