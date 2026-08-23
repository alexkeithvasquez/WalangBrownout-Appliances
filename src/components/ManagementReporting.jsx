import { useState } from 'react'
import Card from './common/Card'
import Badge from './common/Badge'
import Button from './common/Button'
import StatCard from './common/StatCard'
import PageHeader from './common/PageHeader'

const HOLDING_COST_BY_CATEGORY = [
  { label: 'AC Units', value: 210000 },
  { label: 'Purifiers', value: 96000 },
  { label: 'Thermostats', value: 140000 },
  { label: 'Filters', value: 36000 },
]
const MAX_HOLDING_COST = Math.max(...HOLDING_COST_BY_CATEGORY.map((c) => c.value))

const STOCKOUT_TREND = [2, 3, 4, 6, 7, 5, 4, 5]
const MAX_STOCKOUT = Math.max(...STOCKOUT_TREND)

const INITIAL_DISCREPANCIES = [
  {
    sku: 'Smart-Therm-X',
    system: 45,
    counted: 12,
    variance: -33,
    status: 'Investigating',
    flagged: 'Jun 2, 2026',
  },
  {
    sku: 'Filter-Carbon-9m',
    system: 80,
    counted: 76,
    variance: -4,
    status: 'Resolved',
    flagged: 'May 20, 2026',
  },
]

export default function ManagementReporting() {
  const [discrepancies, setDiscrepancies] = useState(INITIAL_DISCREPANCIES)

  function resolveCase(sku) {
    setDiscrepancies((prev) =>
      prev.map((d) => (d.sku === sku ? { ...d, status: 'Resolved' } : d)),
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="MOD-04 · Management"
          title="Management Reporting"
        />
        <select
          defaultValue="Q2 2026"
          className="rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink"
        >
          <option>Q1 2026</option>
          <option>Q2 2026</option>
          <option>Q3 2026</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total holding cost" value="₱482,000" hint="▲ 8% vs last Q" tone="danger" />
        <StatCard
          label="Write-off value (YTD)"
          value="₱15,000"
          hint="▼ 60% vs last Q"
          tone="success"
        />
        <StatCard label="Stockout frequency" value="7 events" hint="▼ improving" />
        <StatCard
          label="Sales growth (YoY)"
          value="35%"
          hint="margin now protected"
          tone="success"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Holding cost by category</h2>
          <div className="mt-6 flex h-40 items-end gap-4">
            {HOLDING_COST_BY_CATEGORY.map((c) => (
              <div key={c.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className="w-full rounded-t-md bg-online/70"
                  style={{ height: `${Math.round((c.value / MAX_HOLDING_COST) * 140)}px` }}
                />
                <span className="text-center text-xs text-muted">{c.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Stockout events over time</h2>
          <div className="mt-6 flex h-40 items-end gap-2">
            {STOCKOUT_TREND.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-power/70"
                style={{ height: `${Math.round((v / MAX_STOCKOUT) * 160)}px` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted">
            <span>Jan</span>
            <span>Peak flagged: June (Class A)</span>
            <span>Aug</span>
          </div>
        </Card>
      </div>

      <Card className="mt-5 p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Open discrepancy investigations
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="pb-3 pr-4 font-mono font-normal">SKU</th>
                <th className="pb-3 pr-4 font-mono font-normal">System qty</th>
                <th className="pb-3 pr-4 font-mono font-normal">Counted</th>
                <th className="pb-3 pr-4 font-mono font-normal">Variance</th>
                <th className="pb-3 pr-4 font-mono font-normal">Flagged</th>
                <th className="pb-3 font-mono font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {discrepancies.map((d) => (
                <tr key={d.sku} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-ink">{d.sku}</td>
                  <td className="py-3 pr-4 text-muted">{d.system}</td>
                  <td className="py-3 pr-4 text-muted">{d.counted}</td>
                  <td className="py-3 pr-4 text-danger">{d.variance}</td>
                  <td className="py-3 pr-4 text-muted">{d.flagged}</td>
                  <td className="py-3">
                    {d.status === 'Resolved' ? (
                      <Badge status="online">Resolved</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge status="danger">Investigating</Badge>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs"
                          onClick={() => resolveCase(d.sku)}
                        >
                          Mark resolved
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
