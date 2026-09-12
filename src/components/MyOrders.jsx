import { useState } from 'react'
import Card from './common/Card'
import Badge from './common/Badge'
import Button from './common/Button'
import PageHeader from './common/PageHeader'
import { useAuth } from '../context/AuthContext'
import {
  getOrdersForCustomer,
  clearOrdersForCustomer,
  cancelOrder,
  ORDER_STAGES,
} from '../lib/orders'

function peso(n) {
  return `₱${Number(n || 0).toLocaleString('en-PH')}`
}

function statusTone(status) {
  if (status === 'Delivered') return 'online'
  if (status === 'In Transit') return 'standby'
  if (status === 'Cancelled') return 'danger'
  return 'offline'
}

export default function MyOrders() {
  const { currentUser } = useAuth()
  const [orders, setOrders] = useState(() => getOrdersForCustomer(currentUser.email))
  const [notice, setNotice] = useState('')

  function handleClearAll() {
    const confirmed = window.confirm('Clear all your orders? This cannot be undone.')
    if (!confirmed) return

    clearOrdersForCustomer(currentUser.email)
    setOrders([])
  }

  function handleCancel(order) {
    const confirmed = window.confirm(`Cancel order ${order.code}?`)
    if (!confirmed) return

    const result = cancelOrder(order.id)
    if (!result.ok) {
      setNotice(result.error)
      setTimeout(() => setNotice(''), 3000)
      return
    }

    setOrders((previous) =>
      previous.map((o) => (o.id === order.id ? result.order : o)),
    )
    setNotice(`Order ${order.code} was cancelled.`)
    setTimeout(() => setNotice(''), 3000)
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="My Orders"
          subtitle="Track every purchase from processing to delivery."
        />
        {orders.length > 0 && (
          <Button
            variant="ghost"
            onClick={handleClearAll}
            className="mt-1 text-danger hover:bg-danger/10"
          >
            Clear my orders
          </Button>
        )}
      </div>

      {notice && (
        <p className="mt-4 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink">
          {notice}
        </p>
      )}

      {orders.length === 0 ? (
        <Card className="mt-4 p-8 text-center text-sm text-muted">
          No orders yet — head to the storefront to place one.
        </Card>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => {
            const activeIdx = ORDER_STAGES.indexOf(order.status)
            const isCancelled = order.status === 'Cancelled'
            const canCancel = order.status === 'Processing' || order.status === 'In Transit'

            return (
              <Card key={order.id} className={`p-5 ${isCancelled ? 'opacity-70' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm text-ink">{order.code}</p>
                    <p className="text-xs text-muted">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.payment}
                    </p>
                  </div>
                  <Badge status={statusTone(order.status)}>{order.status}</Badge>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-border pt-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted">
                        ×{item.qty} {item.name}
                      </span>
                      <span className="font-mono text-ink">{peso(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted">Total</span>
                  <span className="font-display text-base font-semibold text-ink">
                    {peso(order.total)}
                  </span>
                </div>

                {isCancelled ? (
                  <p className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
                    Cancelled on {new Date(order.cancelledAt).toLocaleDateString()}
                  </p>
                ) : (
                  <div className="mt-4 flex items-center gap-2">
                    {ORDER_STAGES.map((stage, i) => (
                      <div key={stage} className="flex flex-1 items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            i <= activeIdx ? 'bg-power' : 'bg-border'
                          }`}
                        />
                        <span
                          className={`text-[10px] uppercase tracking-wider ${
                            i <= activeIdx ? 'text-power' : 'text-muted'
                          }`}
                        >
                          {stage}
                        </span>
                        {i < ORDER_STAGES.length - 1 && (
                          <div
                            className={`h-px flex-1 ${i < activeIdx ? 'bg-power' : 'bg-border'}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {canCancel && (
                  <button
                    type="button"
                    onClick={() => handleCancel(order)}
                    className="mt-4 text-xs text-danger hover:underline"
                  >
                    Cancel this order
                  </button>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}