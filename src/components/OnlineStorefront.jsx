import { useMemo, useState } from 'react'
import Card from './common/Card'
import Badge from './common/Badge'
import Button from './common/Button'
import PageHeader from './common/PageHeader'

const PRODUCTS = [
  {
    id: 'ac-12k',
    name: 'Portable AC 12k BTU',
    category: 'Air Conditioners',
    price: 18500,
    available: 12,
    color: 'bg-online/15 text-online',
  },
  {
    id: 'therm-x',
    name: 'Smart Thermostat X',
    category: 'Thermostats',
    price: 4200,
    available: 2,
    color: 'bg-power/15 text-power',
  },
  {
    id: 'filter-carbon',
    name: 'Carbon Air Filter',
    category: 'Filters',
    price: 650,
    available: 0,
    color: 'bg-surface-2 text-muted',
  },
  {
    id: 'purifier-mini',
    name: 'Air Purifier Mini',
    category: 'Air Purifiers',
    price: 6900,
    available: 27,
    color: 'bg-online/15 text-online',
  },
]

const CATEGORIES = ['Air Conditioners', 'Air Purifiers', 'Filters', 'Thermostats']

function stockLabel(available) {
  if (available === 0) return { text: 'Out of stock', status: 'danger' }
  if (available <= 2) return { text: `Only ${available} left`, status: 'standby' }
  return { text: `${available} available`, status: 'online' }
}

export default function OnlineStorefront() {
  const [activeCategories, setActiveCategories] = useState([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [cart, setCart] = useState({})

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (activeCategories.length && !activeCategories.includes(p.category)) return false
      if (inStockOnly && p.available === 0) return false
      return true
    })
  }, [activeCategories, inStockOnly])

  const cartCount = Object.values(cart).reduce((sum, n) => sum + n, 0)

  function toggleCategory(cat) {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  function addToCart(id) {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="mb-8 flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="MOD-03 · Storefront"
          title="Online Storefront"
        />
        <Badge status="online" pulse>
          Cart {cartCount}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <div>
            <p className="mb-3 text-xs uppercase tracking-wider text-muted">Filters</p>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={activeCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="h-4 w-4 rounded border-border bg-surface-2 accent-online"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-surface-2 accent-online"
            />
            In stock only
          </label>
        </aside>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const stock = stockLabel(p.available)
            const inCart = cart[p.id] || 0
            return (
              <Card key={p.id} className="flex flex-col overflow-hidden p-5">
                <div
                  className={`mb-4 flex h-28 items-center justify-center rounded-md text-xs font-mono ${p.color}`}
                >
                  {p.name}
                </div>
                <h3 className="font-display text-base font-semibold text-ink">{p.name}</h3>
                <p className="mt-1 font-mono text-sm text-ink">
                  ₱{p.price.toLocaleString()}
                </p>
                <div className="mt-2">
                  <Badge status={stock.status}>{stock.text}</Badge>
                </div>
                <Button
                  variant={p.available === 0 ? 'ghost' : 'primary'}
                  className="mt-4"
                  disabled={p.available === 0}
                  onClick={() => addToCart(p.id)}
                >
                  {p.available === 0 ? 'Notify me' : inCart > 0 ? `In cart (${inCart})` : 'Add to cart'}
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
