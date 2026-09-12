import { useEffect, useState } from 'react'
import Card from './common/Card'
import Badge from './common/Badge'
import Button from './common/Button'
import PageHeader from './common/PageHeader'

const TABS = [
  { id: 'pick', label: 'Pick' },
  { id: 'receive', label: 'Receive' },
  { id: 'count', label: 'Count' },
  { id: 'register', label: 'Register item' },
]

const PRODUCTS_KEY = 'wb_products'
const BATCHES_KEY = 'wb_inventory_batches'

const INPUT_CLASS =
  'w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-power'

const LABEL_CLASS =
  'mb-1 block text-xs uppercase tracking-wider text-muted'

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

const SEED_PRODUCTS = [
  {
    sku: 'AC-Unit-12k',
    name: 'Portable AC 12k BTU',
    category: 'Air Conditioners',
    price: 18500,
    reorderPoint: 40,
    openingQty: 18,
    bin: 'C-01-1',
    expiry: '',
    registeredAt: new Date().toISOString(),
  },
  {
    sku: 'Smart-Therm-X',
    name: 'Smart Thermostat X',
    category: 'Thermostats',
    price: 4200,
    reorderPoint: 15,
    openingQty: 9,
    bin: 'B-02-1',
    expiry: '',
    registeredAt: new Date().toISOString(),
  },
  {
    sku: 'Filter-Carbon-9m',
    name: 'Carbon Air Filter',
    category: 'Filters',
    price: 650,
    reorderPoint: 25,
    openingQty: 30,
    bin: 'C-14-2',
    expiry: '',
    registeredAt: new Date().toISOString(),
  },
  {
    sku: 'Air-Purifier-Mini',
    name: 'Air Purifier Mini',
    category: 'Air Purifiers',
    price: 6900,
    reorderPoint: 20,
    openingQty: 27,
    bin: 'D-05-3',
    expiry: '',
    registeredAt: new Date().toISOString(),
  },
]

function seedProducts() {
  const existing = readList(PRODUCTS_KEY)
  if (existing.length === 0) {
    writeList(PRODUCTS_KEY, SEED_PRODUCTS)
  }
}

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
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              scannedBatch: item.batch,
              fifo: 'ok',
              picked: true,
            }
          : item,
      ),
    )
  }

  function switchToCorrectBatch(id) {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              scannedBatch: item.batch,
              fifo: 'ok',
              picked: true,
            }
          : item,
      ),
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">
          Order #10432 · 2 items
        </h2>

        <Badge status="standby">FIFO enforced</Badge>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-lg border bg-surface-2 p-4 ${
              item.fifo === 'warn'
                ? 'border-danger/40'
                : 'border-online/30'
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

                <Badge
                  status={
                    item.fifo === 'warn' ? 'danger' : 'online'
                  }
                >
                  {item.fifo === 'warn' ? 'FIFO WARN' : 'FIFO OK'}
                </Badge>
              </div>

              {item.fifo === 'ok' && !item.picked && (
                <>
                  <p className="text-sm text-muted">
                    Batch {item.batch} (oldest / FIFO) · Bin {item.bin} ·
                    Qty {item.qty}
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
                    Oldest unexpired batch is {item.batch}. Pick that one
                    first.
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
                <p className="text-sm text-online">
                  Picked · Batch {item.batch} confirmed
                </p>
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
  const [error, setError] = useState('')

  function handleSave(event) {
    event.preventDefault()
    setError('')

    const cleanSku = sku.trim()
    const quantity = Number(qty)
    const products = readList(PRODUCTS_KEY)

    if (!cleanSku || !Number.isInteger(quantity) || quantity < 1) {
      setError('Enter a valid SKU and quantity.')
      return
    }

    const productExists = products.some(
      (product) =>
        product.sku.toLowerCase() === cleanSku.toLowerCase(),
    )

    if (!productExists) {
      setError(
        'This SKU is not registered yet. Register the item first.',
      )
      return
    }

    const receivedAt = new Date()
    const expiry = new Date(receivedAt)
    expiry.setMonth(expiry.getMonth() + 9)

    const receipt = {
      id: `${Date.now()}`,
      sku: cleanSku,
      qty: quantity,
      batch: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      receiptDate: receivedAt.toISOString(),
      expiry: expiry.toISOString(),
    }

    writeList(BATCHES_KEY, [
      receipt,
      ...readList(BATCHES_KEY),
    ])

    setReceipts((previous) => [receipt, ...previous])
    setSku('')
    setQty('')
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        Receive shipment
      </h2>

      <p className="mt-1 text-sm text-muted">
        Only registered SKUs can be received into inventory.
      </p>

      <form onSubmit={handleSave} className="mt-4 space-y-3">
        <div>
          <label className={LABEL_CLASS}>Registered SKU</label>

          <input
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            placeholder="e.g. Filter-Carbon-9m"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Qty received</label>

          <input
            type="number"
            min="1"
            value={qty}
            onChange={(event) => setQty(event.target.value)}
            placeholder="0"
            className={INPUT_CLASS}
          />
        </div>

        {error && (
          <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <p className="text-xs text-muted">
          Batch number and expiry date are generated automatically.
        </p>

        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto"
        >
          Save batch
        </Button>
      </form>

      {receipts.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted">
            Recent receipts
          </p>

          <div className="space-y-2">
            {receipts.map((receipt) => (
              <div
                key={receipt.id}
                className="rounded-md border border-border bg-surface-2 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ink">
                    {receipt.sku}
                  </span>

                  <span className="font-mono text-xs text-online">
                    {receipt.batch}
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted">
                  Qty {receipt.qty} · received{' '}
                  {new Date(receipt.receiptDate).toLocaleDateString()} ·
                  expires{' '}
                  {new Date(receipt.expiry).toLocaleDateString()}
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

  function handleSubmit(event) {
    event.preventDefault()

    if (counted === '') return

    const countedQuantity = Number(counted)
    const variance = countedQuantity - systemQty

    setHistory((previous) => [
      {
        id: `${Date.now()}`,
        counted: countedQuantity,
        variance,
        flagged: Math.abs(variance) > 2,
      },
      ...previous,
    ])

    setCounted('')
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        Cycle count entry
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <p className="text-sm text-muted">
          Bin C-14-2 · System says:{' '}
          <span className="font-mono text-ink">{systemQty}</span>
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="number"
            min="0"
            value={counted}
            onChange={(event) => setCounted(event.target.value)}
            placeholder="Counted qty"
            className={`flex-1 ${INPUT_CLASS}`}
          />

          <Button type="submit" variant="primary">
            Submit count
          </Button>
        </div>
      </form>

      {history.length > 0 && (
        <div className="mt-6 space-y-2 border-t border-border pt-4">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-md border border-border bg-surface-2 p-3 text-sm"
            >
              <span className="text-muted">
                Counted {entry.counted} · variance{' '}
                {entry.variance > 0 ? '+' : ''}
                {entry.variance}
              </span>

              <Badge
                status={entry.flagged ? 'danger' : 'online'}
              >
                {entry.flagged
                  ? 'Discrepancy logged'
                  : 'Count matches'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function RegisterItemTab() {
  const [form, setForm] = useState({
    sku: '',
    name: '',
    category: 'Other',
    price: '',
    reorderPoint: '',
    openingQty: '',
    bin: '',
    expiry: '',
  })

  const [registered, setRegistered] = useState(() =>
    readList(PRODUCTS_KEY).slice(0, 5),
  )

  const [message, setMessage] = useState({
    type: '',
    text: '',
  })

  const categories = [
    'Air Conditioners',
    'Air Purifiers',
    'Filters',
    'Thermostats',
    'Other',
  ]

  function update(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function handleRegister(event) {
    event.preventDefault()
    setMessage({ type: '', text: '' })

    const item = {
      ...form,
      sku: form.sku.trim(),
      name: form.name.trim(),
      price: Number(form.price),
      reorderPoint: Number(form.reorderPoint),
      openingQty: Number(form.openingQty),
      registeredAt: new Date().toISOString(),
    }

    if (
      !item.sku ||
      !item.name ||
      !item.bin ||
      !item.expiry ||
      !Number.isFinite(item.price) ||
      !Number.isFinite(item.reorderPoint) ||
      !Number.isFinite(item.openingQty)
    ) {
      setMessage({
        type: 'error',
        text: 'Complete all fields with valid values.',
      })
      return
    }

    if (
      item.price < 0 ||
      item.reorderPoint < 0 ||
      item.openingQty < 0
    ) {
      setMessage({
        type: 'error',
        text: 'Price, reorder point, and opening quantity cannot be negative.',
      })
      return
    }

    const products = readList(PRODUCTS_KEY)

    const duplicateSku = products.some(
      (product) =>
        product.sku.toLowerCase() === item.sku.toLowerCase(),
    )

    if (duplicateSku) {
      setMessage({
        type: 'error',
        text: 'That SKU is already registered. Use Receive to add another batch.',
      })
      return
    }

    writeList(PRODUCTS_KEY, [item, ...products])

    if (item.openingQty > 0) {
      const openingBatch = {
        id: `${Date.now()}`,
        sku: item.sku,
        qty: item.openingQty,
        batch: `OPEN-${Math.floor(1000 + Math.random() * 9000)}`,
        receiptDate: new Date().toISOString(),
        expiry: new Date(item.expiry).toISOString(),
        bin: item.bin,
      }

      writeList(BATCHES_KEY, [
        openingBatch,
        ...readList(BATCHES_KEY),
      ])
    }

    setRegistered((previous) =>
      [item, ...previous].slice(0, 5),
    )

    setForm({
      sku: '',
      name: '',
      category: 'Other',
      price: '',
      reorderPoint: '',
      openingQty: '',
      bin: '',
      expiry: '',
    })

    setMessage({
      type: 'success',
      text: `${item.name} was registered${
        item.openingQty > 0
          ? ' and opening stock was added'
          : ''
      }.`,
    })
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">
            Register new item
          </h2>

          <p className="mt-1 max-w-xl text-sm text-muted">
            Register a new SKU before receiving, picking, counting, or
            selling it.
          </p>
        </div>

        <Badge status="standby">
          Required for new SKUs
        </Badge>
      </div>

      <form
        onSubmit={handleRegister}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div>
          <label className={LABEL_CLASS}>SKU / item code</label>

          <input
            required
            value={form.sku}
            onChange={(event) =>
              update('sku', event.target.value)
            }
            placeholder="e.g. Fan-Tower-01"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Item name</label>

          <input
            required
            value={form.name}
            onChange={(event) =>
              update('name', event.target.value)
            }
            placeholder="e.g. Tower Fan"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Category</label>

          <select
            value={form.category}
            onChange={(event) =>
              update('category', event.target.value)
            }
            className={INPUT_CLASS}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL_CLASS}>Unit price (₱)</label>

          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) =>
              update('price', event.target.value)
            }
            placeholder="0"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Reorder point</label>

          <input
            required
            type="number"
            min="0"
            value={form.reorderPoint}
            onChange={(event) =>
              update('reorderPoint', event.target.value)
            }
            placeholder="0"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Opening quantity</label>

          <input
            required
            type="number"
            min="0"
            value={form.openingQty}
            onChange={(event) =>
              update('openingQty', event.target.value)
            }
            placeholder="0"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Storage bin</label>

          <input
            required
            value={form.bin}
            onChange={(event) =>
              update('bin', event.target.value)
            }
            placeholder="e.g. B-02-1"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Expiry date</label>

          <input
            required
            type="date"
            value={form.expiry}
            onChange={(event) =>
              update('expiry', event.target.value)
            }
            className={INPUT_CLASS}
          />
        </div>

        <div className="sm:col-span-2">
          {message.text && (
            <p
              className={`mb-3 rounded-md border px-3 py-2 text-sm ${
                message.type === 'error'
                  ? 'border-danger/30 bg-danger/10 text-danger'
                  : 'border-online/30 bg-online/10 text-online'
              }`}
            >
              {message.text}
            </p>
          )}

          <Button type="submit" variant="primary">
            Register item
          </Button>
        </div>
      </form>

      {registered.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted">
            Recently registered
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {registered.map((item) => (
              <div
                key={item.sku}
                className="rounded-md border border-border bg-surface-2 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink">
                    {item.name}
                  </span>

                  <Badge status="online">Registered</Badge>
                </div>

                <p className="mt-1 font-mono text-xs text-muted">
                  {item.sku} · {item.category}
                </p>

                <p className="mt-1 text-xs text-muted">
                  Bin {item.bin} · Opening qty {item.openingQty}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default function WarehouseScannerApp() {
  const [tab, setTab] = useState('pick')

  useEffect(() => {
    seedProducts()
  }, [])


  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <PageHeader
        title="Warehouse / Scanner App"
        subtitle="Register new SKUs before receiving them into inventory."
      />

      <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface p-1 sm:grid-cols-4">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              tab === item.id
                ? 'bg-online text-bg'
                : 'text-muted hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'pick' && <PickTab />}
      {tab === 'receive' && <ReceiveTab />}
      {tab === 'count' && <CountTab />}
      {tab === 'register' && <RegisterItemTab />}
    </main>
  )
}
