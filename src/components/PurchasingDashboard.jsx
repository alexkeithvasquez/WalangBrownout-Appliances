import { useMemo, useState } from 'react'
import Card from './common/Card'
import Badge from './common/Badge'
import Button from './common/Button'
import StatCard from './common/StatCard'
import PageHeader from './common/PageHeader'

const PRODUCTS_KEY = 'wb_products'
const PURCHASE_ORDERS_KEY = 'wb_purchase_orders'

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function peso(n) {
  return `₱${Number(n || 0).toLocaleString('en-PH')}`
}

const CATEGORY_TONES = {
  'Air Conditioners': 'bg-power',
  'Air Purifiers': 'bg-online',
  Filters: 'bg-danger',
  Thermostats: 'bg-power',
  Other: 'bg-muted',
}

export default function PurchasingDashboard() {
  const [products, setProducts] = useState(() => readList(PRODUCTS_KEY))
  const [purchaseOrders, setPurchaseOrders] = useState(() => readList(PURCHASE_ORDERS_KEY))
  const [notice, setNotice] = useState('')

  const alerts = useMemo(() => {
    const openPoSkus = new Set(
      purchaseOrders.filter((po) => po.status === 'Pending').map((po) => po.sku),
    )
    return products
      .map((p) => {
        const belowRop = Number(p.openingQty) <= Number(p.reorderPoint)
        return {
          sku: p.sku,
          name: p.name,
          category: p.category,
          available: Number(p.openingQty) || 0,
          rop: Number(p.reorderPoint) || 0,
          status: openPoSkus.has(p.sku) ? 'ordered' : belowRop ? 'reorder' : 'ok',
        }
      })
      .sort((a, b) => {
        const rank = { reorder: 0, ordered: 1, ok: 2 }
        return rank[a.status] - rank[b.status]
      })
  }, [products, purchaseOrders])

  const belowRop = alerts.filter((a) => a.status === 'reorder').length
  const pendingPOs = purchaseOrders.filter((po) => po.status === 'Pending').length
  const totalCommitted = purchaseOrders
    .filter((po) => po.status === 'Pending')
    .reduce((sum, po) => sum + po.estCost, 0)

  const categoryBreakdown = useMemo(() => {
    const counts = {}
    products.forEach((p) => {
      const cat = p.category || 'Other'
      counts[cat] = (counts[cat] || 0) + 1
    })
    const total = products.length || 1
    return Object.entries(counts)
      .map(([label, count]) => ({ label, count, pct: (count / total) * 100 }))
      .sort((a, b) => b.count - a.count)
  }, [products])

  function handleReorder(alert) {
    const product = products.find((p) => p.sku === alert.sku)
    const suggestedQty = Math.max(alert.rop * 2 - alert.available, alert.rop)
    const estCost = suggestedQty * (Number(product?.price) || 0)

    const po = {
      id: `PO-${Date.now()}`,
      sku: alert.sku,
      name: alert.name,
      qty: suggestedQty,
      estCost,
      status: 'Pending',
      createdAt: Date.now(),
    }

    const updated = [po, ...purchaseOrders]
    writeList(PURCHASE_ORDERS_KEY, updated)
    setPurchaseOrders(updated)
    setNotice(`Purchase order created for ${suggestedQty} × ${alert.name}.`)
    setTimeout(() => setNotice(''), 3000)
  }

  function refresh() {
    setProducts(readList(PRODUCTS_KEY))
    setPurchaseOrders(readList(PURCHASE_ORDERS_KEY))
  }

  function clearDemoData() {
    const confirmed = window.confirm(
      'Clear all purchase orders? Registered products and stock levels will be kept.',
    )
    if (!confirmed) return

    writeList(PURCHASE_ORDERS_KEY, [])
    setPurchaseOrders([])
    setNotice('Purchase orders cleared.')
    setTimeout(() => setNotice(''), 3000)
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="MOD-01 · Purchasing"
          title="Purchasing Dashboard"
          subtitle="Reorder alerts and purchase orders, driven by what's registered in the warehouse."
        />
        <div className="mt-1 flex items-center gap-2">
          <Button variant="ghost" onClick={refresh}>
            Refresh
          </Button>
          <Button variant="ghost" onClick={clearDemoData} className="text-danger hover:bg-danger/10">
            Clear demo data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="SKUs below ROP"
          value={belowRop}
          hint="needs action"
          tone={belowRop > 0 ? 'danger' : 'success'}
        />
        <StatCard label="Pending POs" value={pendingPOs} hint="awaiting delivery" />
        <StatCard label="Committed spend" value={peso(totalCommitted)} hint="open purchase orders" />
        <StatCard
          label="Stockout risk"
          value={belowRop >= 2 ? 'Medium' : belowRop === 1 ? 'Low' : 'None'}
          tone={belowRop >= 2 ? 'warning' : belowRop === 1 ? 'neutral' : 'success'}
          hint="based on ROP engine"
        />
      </div>

      {notice && (
        <p className="mt-4 rounded-md border border-online/30 bg-online/10 px-3 py-2 text-sm text-online">
          {notice}
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Reorder point alerts</h2>
          <p className="mt-1 text-sm text-muted">
            Pulled from registered SKUs in the Warehouse module.
          </p>

          {alerts.length === 0 ? (
            <p className="mt-6 rounded-md border border-border bg-surface-2 p-4 text-sm text-muted">
              No SKUs registered yet — add items from the Warehouse module to see alerts here.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                    <th className="pb-3 pr-4 font-mono font-normal">SKU</th>
                    <th className="pb-3 pr-4 font-mono font-normal">Category</th>
                    <th className="pb-3 pr-4 font-mono font-normal">Available</th>
                    <th className="pb-3 pr-4 font-mono font-normal">ROP</th>
                    <th className="pb-3 font-mono font-normal">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((a) => (
                    <tr key={a.sku} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-ink">{a.name}</p>
                        <p className="font-mono text-xs text-muted">{a.sku}</p>
                      </td>
                      <td className="py-3 pr-4 text-muted">{a.category}</td>
                      <td className="py-3 pr-4 text-muted">{a.available}</td>
                      <td className="py-3 pr-4 text-muted">{a.rop}</td>
                      <td className="py-3">
                        {a.status === 'ok' && <Badge status="online">OK</Badge>}
                        {a.status === 'reorder' && (
                          <Button
                            variant="primary"
                            className="px-3 py-1.5 text-xs"
                            onClick={() => handleReorder(a)}
                          >
                            Reorder
                          </Button>
                        )}
                        {a.status === 'ordered' && <Badge status="standby">PO pending</Badge>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Catalogue by category</h2>
            {categoryBreakdown.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No products registered yet.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {categoryBreakdown.map((c) => (
                  <div key={c.label}>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="text-muted">{c.label}</span>
                      <span className="font-mono text-ink">{c.count} SKUs</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={`h-full rounded-full ${CATEGORY_TONES[c.label] || 'bg-muted'}`}
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Recent purchase orders</h2>
            {purchaseOrders.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No purchase orders yet.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {purchaseOrders.slice(0, 6).map((po) => (
                  <div key={po.id} className="rounded-md border border-border bg-surface-2 p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-ink">{po.name}</span>
                      <Badge status={po.status === 'Pending' ? 'standby' : 'online'}>{po.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      Qty {po.qty} · est. {peso(po.estCost)} · {new Date(po.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}