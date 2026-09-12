import Card from './common/Card'
import Badge from './common/Badge'
import PageHeader from './common/PageHeader'
import { useAuth } from '../context/AuthContext'
import { getOrdersForCustomer, ORDER_STAGES } from '../lib/orders'

function peso(n) {
  return `₱${Number(n || 0).toLocaleString('en-PH')}`
}

function statusTone(status) {
  if (status === 'Delivered') return 'online'
  if (status === 'In Transit') return 'standby'
  return 'offline'
}

export default function MyOrders() {
  const { currentUser } = useAuth()
  const orders = getOrdersForCustomer(currentUser.email)

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <PageHeader
        eyebrow="Account"
        title="My Orders"
        subtitle="Track every purchase from processing to delivery."
      />

      {orders.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">
          No orders yet — head to the storefront to place one.
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const activeIdx = ORDER_STAGES.indexOf(order.status)
            return (
              <Card key={order.id} className="p-5">
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
              </Card>
            )
          })}
        </div>
      )}
    </main>
  )
}