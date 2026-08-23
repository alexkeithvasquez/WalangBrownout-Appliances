import { useMemo, useState } from 'react'
import Card from './common/Card'
import Badge from './common/Badge'
import Button from './common/Button'
import StatCard from './common/StatCard'
import PageHeader from './common/PageHeader'

const INITIAL_ALERTS = [
  {
    sku: 'AC-Unit-12k',
    abc: 'A',
    available: 18,
    rop: 40,
    season: 'Peak',
    status: 'reorder',
  },
  {
    sku: 'Smart-Therm-X',
    abc: 'A',
    available: 9,
    rop: 15,
    season: 'Normal',
    status: 'reorder',
  },
  {
    sku: 'Filter-Carbon-9m',
    abc: 'C',
    available: 30,
    rop: 25,
    season: 'Normal',
    status: 'ok',
  },
  {
    sku: 'Air-Purifier-Mini',
    abc: 'B',
    available: 27,
    rop: 20,
    season: 'Normal',
    status: 'ok',
  },
]

const ABC_BREAKDOWN = [
  { label: 'Class A — high value', count: 12, tone: 'bg-danger' },
  { label: 'Class B — moderate', count: 28, tone: 'bg-power' },
  { label: 'Class C — low value, FIFO enforced', count: 61, tone: 'bg-online' },
]

const ABC_TOTAL = ABC_BREAKDOWN.reduce((sum, c) => sum + c.count, 0)

export default function PurchasingDashboard() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)

  const belowRop = useMemo(
    () => alerts.filter((a) => a.status === 'reorder').length,
    [alerts],
  )
  const seasonalWatch = useMemo(
    () => alerts.filter((a) => a.season === 'Peak').length,
    [alerts],
  )
  const pendingPOs = useMemo(
    () => alerts.filter((a) => a.status === 'ordered').length,
    [alerts],
  )

  function handleReorder(sku) {
    setAlerts((prev) =>
      prev.map((a) => (a.sku === sku ? { ...a, status: 'ordered' } : a)),
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <PageHeader
        eyebrow="MOD-01 · Purchasing"
        title="Purchasing Dashboard"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="SKUs below ROP"
          value={belowRop}
          hint="needs action"
          tone={belowRop > 0 ? 'danger' : 'success'}
        />
        <StatCard label="Seasonal watchlist" value={seasonalWatch} hint="peak-season SKUs" />
        <StatCard label="Pending POs" value={pendingPOs} hint="awaiting approval" />
        <StatCard
          label="Stockout risk"
          value={belowRop >= 2 ? 'Medium' : 'Low'}
          tone={belowRop >= 2 ? 'warning' : 'success'}
          hint="based on ROP engine"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Reorder point alerts</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                  <th className="pb-3 pr-4 font-mono font-normal">SKU</th>
                  <th className="pb-3 pr-4 font-mono font-normal">ABC</th>
                  <th className="pb-3 pr-4 font-mono font-normal">Available</th>
                  <th className="pb-3 pr-4 font-mono font-normal">ROP</th>
                  <th className="pb-3 pr-4 font-mono font-normal">Season</th>
                  <th className="pb-3 font-mono font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((a) => (
                  <tr key={a.sku} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-4 font-medium text-ink">{a.sku}</td>
                    <td className="py-3 pr-4 text-muted">{a.abc}</td>
                    <td className="py-3 pr-4 text-muted">{a.available}</td>
                    <td className="py-3 pr-4 text-muted">{a.rop}</td>
                    <td className="py-3 pr-4 text-muted">{a.season}</td>
                    <td className="py-3">
                      {a.status === 'ok' && (
                        <Badge status="online">OK</Badge>
                      )}
                      {a.status === 'reorder' && (
                        <Button
                          variant="primary"
                          className="px-3 py-1.5 text-xs"
                          onClick={() => handleReorder(a.sku)}
                        >
                          Reorder
                        </Button>
                      )}
                      {a.status === 'ordered' && <Badge status="online">PO sent</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-ink">ABC classification</h2>
          <div className="mt-5 space-y-4">
            {ABC_BREAKDOWN.map((c) => (
              <div key={c.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted">{c.label}</span>
                  <span className="font-mono text-ink">{c.count} SKUs</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className={`h-full rounded-full ${c.tone}`}
                    style={{ width: `${(c.count / ABC_TOTAL) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
