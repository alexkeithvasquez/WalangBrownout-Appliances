import { useState } from 'react'
import Card from './common/Card'
import Badge from './common/Badge'
import Button from './common/Button'
import PageHeader from './common/PageHeader'

const TABS = [
  { id: 'pick', label: 'Pick' },
  { id: 'receive', label: 'Receive' },
  { id: 'count', label: 'Count' },
]

const INITIAL_PICK_ITEMS = [
  {
    id: 1,
    sku: 'Filter-Carbon-9m',
    batch: 'LOT-0231',
    bin: 'C-14-2',
    qty: 3,
    scannedBatch: null,
    fifo: 'ok',
  },
  {
    id: 2,
    sku: 'Filter-Carbon-9m',
    batch: 'LOT-0231',
    bin: 'C-14-2',
    qty: 2,
    scannedBatch: 'LOT-0255',
    fifo: 'warn',
  },
]

function PickTab() {
  const [items, setItems] = useState(INITIAL_PICK_ITEMS)

  function confirmScan(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, scannedBatch: item.batch, fifo: 'ok', picked: true } : item,
      ),
    )
  }

  function switchToCorrectBatch(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, scannedBatch: item.batch, fifo: 'ok', picked: true } : item,
      ),
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Order #10432 · 2 items</h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-lg border bg-surface-2 p-4 ${
              item.fifo === 'warn' ? 'border-danger/40' : 'border-online/30'
            }`}
          >
            <span
              className={`absolute inset-y-0 left-0 w-1 ${
                item.fifo === 'warn' ? 'bg-danger' : 'bg-online'
              }`}
              aria-hidden="true"
            />
            <div className="pl-2">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium text-ink">{item.sku}</p>
                <Badge status={item.fifo === 'warn' ? 'danger' : 'online'}>
                  {item.fifo === 'warn' ? 'FIFO WARN' : 'FIFO OK'}
                </Badge>
              </div>

              {item.fifo === 'ok' && !item.picked && (
                <>
                  <p className="text-sm text-muted">
                    Batch {item.batch} (oldest / FIFO) · Bin {item.bin} · Qty {item.qty}
                  </p>
                  <Button
                    variant="primary"
                    className="mt-3 px-3 py-1.5 text-xs"
                    onClick={() => confirmScan(item.id)}
                  >
                    Scan item
                  </Button>
                </>
              )}

              {item.fifo === 'warn' && (
                <>
                  <p className="text-sm text-muted">
                    Scanned: {item.scannedBatch} (newer batch)
                  </p>
                  <p className="mt-1 text-sm text-danger">
                    Oldest unexpired batch is {item.batch}. Pick that one first.
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-3 px-3 py-1.5 text-xs"
                    onClick={() => switchToCorrectBatch(item.id)}
                  >
                    Switch to {item.batch}
                  </Button>
                </>
              )}

              {item.picked && item.fifo === 'ok' && (
                <p className="text-sm text-online">Picked · Batch {item.batch} confirmed</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ReceiveTab() {
  const [sku, setSku] = useState('')
  const [qty, setQty] = useState('')
  const [receipts, setReceipts] = useState([])

  function handleSave(e) {
    e.preventDefault()
    if (!sku || !qty) return
    const batch = `LOT-${Math.floor(1000 + Math.random() * 9000)}`
    const receiptDate = new Date()
    const expiry = new Date(receiptDate)
    expiry.setMonth(expiry.getMonth() + 9)

    setReceipts((prev) => [
      {
        sku,
        qty,
        batch,
        receiptDate: receiptDate.toLocaleDateString(),
        expiry: expiry.toLocaleDateString(),
      },
      ...prev,
    ])
    setSku('')
    setQty('')
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Receive shipment</h2>
      <form onSubmit={handleSave} className="mt-4 space-y-3">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted">SKU</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="e.g. Filter-Carbon-9m"
            className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-power"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted">
            Qty received
          </label>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="0"
            className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-power"
          />
        </div>
        <p className="text-xs text-muted">Batch/lot # and expiry are auto-generated on save.</p>
        <Button type="submit" variant="primary" className="w-full sm:w-auto">
          Save batch
        </Button>
      </form>

      {receipts.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted">Recent receipts</p>
          <div className="space-y-2">
            {receipts.map((r, i) => (
              <div
                key={i}
                className="rounded-md border border-border bg-surface-2 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">{r.sku}</span>
                  <span className="font-mono text-xs text-online">{r.batch}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Qty {r.qty} · received {r.receiptDate} · expires {r.expiry}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

function CountTab() {
  const systemQty = 30
  const [counted, setCounted] = useState('')
  const [history, setHistory] = useState([])

  function handleSubmit(e) {
    e.preventDefault()
    if (counted === '') return
    const countedNum = Number(counted)
    const variance = countedNum - systemQty
    setHistory((prev) => [
      { counted: countedNum, variance, flagged: Math.abs(variance) > 2 },
      ...prev,
    ])
    setCounted('')
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Cycle count entry</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <p className="text-sm text-muted">
          Bin C-14-2 · System says: <span className="font-mono text-ink">{systemQty}</span>
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="number"
            value={counted}
            onChange={(e) => setCounted(e.target.value)}
            placeholder="Counted qty"
            className="flex-1 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-power"
          />
          <Button type="submit" variant="primary">
            Submit count
          </Button>
        </div>
      </form>

      {history.length > 0 && (
        <div className="mt-6 space-y-2 border-t border-border pt-4">
          {history.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border border-border bg-surface-2 p-3 text-sm"
            >
              <span className="text-muted">
                Counted {h.counted} · variance {h.variance > 0 ? '+' : ''}
                {h.variance}
              </span>
              <Badge status={h.flagged ? 'danger' : 'online'}>
                {h.flagged ? 'Discrepancy logged' : 'Count matches'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function WarehouseScannerApp() {
  const [tab, setTab] = useState('pick')

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <PageHeader
        eyebrow="MOD-02 · Warehouse"
        title="Warehouse / Scanner App"
      />

      <div className="mb-6 flex gap-2 rounded-lg border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-online text-bg' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'pick' && <PickTab />}
      {tab === 'receive' && <ReceiveTab />}
      {tab === 'count' && <CountTab />}
    </main>
  )
}
