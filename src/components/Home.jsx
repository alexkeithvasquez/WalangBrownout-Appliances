import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Badge from './common/Badge'
import Button from './common/Button'
import Card from './common/Card'
import StatCard from './common/StatCard'

function peso(amount) {
  return `₱${Number(amount || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

function availableQty(product) {
  return Number(product.available ?? product.openingQty) || 0
}

export default function Home() {
  const { currentUser } = useAuth()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  function refreshProducts() {
    setIsLoading(true)
    setError('')
    setRefreshKey((key) => key + 1)
  }

  useEffect(() => {
    let active = true

    apiRequest('/products?per_page=100')
      .then((response) => {
        if (active) setProducts(Array.isArray(response?.data) ? response.data : [])
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [refreshKey])

  const activeProducts = useMemo(
    () => products.filter((product) => product.isActive !== false),
    [products],
  )

  const lowStockProducts = useMemo(
    () =>
      activeProducts
        .filter((product) => availableQty(product) <= Number(product.reorderPoint || 0))
        .sort((left, right) => availableQty(left) - availableQty(right)),
    [activeProducts],
  )

  const categoryBreakdown = useMemo(() => {
    const counts = new Map()
    activeProducts.forEach((product) => {
      const category = product.category || 'Uncategorized'
      counts.set(category, (counts.get(category) || 0) + 1)
    })

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => right.count - left.count)
  }, [activeProducts])

  const recentProducts = useMemo(
    () =>
      [...activeProducts].sort((left, right) => {
        const leftTime = Date.parse(left.registeredAt || '') || 0
        const rightTime = Date.parse(right.registeredAt || '') || 0
        return rightTime - leftTime
      }),
    [activeProducts],
  )

  const inventoryValue = activeProducts.reduce(
    (total, product) => total + availableQty(product) * Number(product.price || 0),
    0,
  )
  const firstName = currentUser?.name?.trim().split(/\s+/)[0] || 'there'

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
      <div className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-power">
            WalangBrownout · Operations
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Inventory overview
          </h1>
          <p className="mt-2 text-sm text-muted">
            Hi, {firstName}. Here’s the latest snapshot of your product catalog.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={refreshProducts}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing…' : 'Refresh data'}
          </Button>
          <Button as={Link} to="/warehouse">
            Register item
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-5 flex flex-col gap-3 border-danger/40 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Couldn’t load inventory</p>
            <p className="mt-1 text-xs text-muted">{error}</p>
          </div>
          <Button variant="secondary" onClick={refreshProducts}>
            Try again
          </Button>
        </Card>
      )}

      <section aria-label="Inventory summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active products"
          value={isLoading ? '—' : activeProducts.length}
          hint="registered in the catalog"
          tone="neutral"
        />
        <StatCard
          label="Reorder alerts"
          value={isLoading ? '—' : lowStockProducts.length}
          hint="at or below reorder point"
          tone={lowStockProducts.length > 0 ? 'danger' : 'success'}
        />
        <StatCard
          label="Estimated stock value"
          value={isLoading ? '—' : peso(inventoryValue)}
          hint="unit price × reported quantity"
          tone="warning"
        />
        <StatCard
          label="Categories"
          value={isLoading ? '—' : categoryBreakdown.length}
          hint="represented in the catalog"
          tone="success"
        />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Card as="section" className="overflow-hidden" aria-labelledby="reorder-title">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
            <div>
              <h2 id="reorder-title" className="font-display text-lg font-semibold text-ink">
                Stock watchlist
              </h2>
              <p className="mt-1 text-xs text-muted">
                Products at or below their configured reorder point.
              </p>
            </div>
            <Badge status={lowStockProducts.length ? 'standby' : 'online'}>
              {isLoading ? 'Loading' : `${lowStockProducts.length} to review`}
            </Badge>
          </div>

          {isLoading ? (
            <p className="px-6 py-8 text-sm text-muted" role="status">Loading products…</p>
          ) : lowStockProducts.length === 0 ? (
            <div className="px-6 py-8">
              <p className="text-sm font-medium text-ink">No reorder alerts right now.</p>
              <p className="mt-1 text-xs text-muted">Newly registered products will appear here when they reach their reorder point.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted">
                    <th scope="col" className="px-5 py-3 font-mono font-normal sm:px-6">Product</th>
                    <th scope="col" className="px-4 py-3 font-mono font-normal">Category</th>
                    <th scope="col" className="px-4 py-3 font-mono font-normal">Qty / ROP</th>
                    <th scope="col" className="px-5 py-3 text-right font-mono font-normal sm:px-6">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.slice(0, 6).map((product) => {
                    const quantity = availableQty(product)
                    return (
                      <tr key={product.id ?? product.sku} className="border-b border-border/60 last:border-0">
                        <td className="px-5 py-3 sm:px-6">
                          <p className="font-medium text-ink">{product.name}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-muted">{product.sku}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted">{product.category}</td>
                        <td className="px-4 py-3 font-mono text-xs text-ink">
                          {quantity} <span className="text-muted">/ {product.reorderPoint}</span>
                        </td>
                        <td className="px-5 py-3 text-right sm:px-6">
                          <Badge status={quantity === 0 ? 'danger' : 'standby'}>
                            {quantity === 0 ? 'Out of stock' : 'Reorder'}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card as="section" className="p-5 sm:p-6" aria-labelledby="catalog-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="catalog-title" className="font-display text-lg font-semibold text-ink">
                Catalog by category
              </h2>
              <p className="mt-1 text-xs text-muted">Share of active products.</p>
            </div>
            <Link to="/warehouse" className="whitespace-nowrap text-xs font-medium text-power hover:underline">
              View warehouse →
            </Link>
          </div>

          {isLoading ? (
            <p className="mt-6 text-sm text-muted" role="status">Loading categories…</p>
          ) : categoryBreakdown.length === 0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-border p-5 text-center">
              <p className="text-sm font-medium text-ink">Your catalog is ready to grow.</p>
              <p className="mt-1 text-xs text-muted">Register a product to see category insights here.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {categoryBreakdown.slice(0, 5).map((category, index) => {
                const percent = Math.round((category.count / activeProducts.length) * 100)
                const barTone = ['bg-power', 'bg-online', 'bg-danger', 'bg-sky-400', 'bg-violet-400'][index]
                return (
                  <div key={category.name}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate text-muted">{category.name}</span>
                      <span className="shrink-0 font-mono text-ink">{category.count} · {percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                      <div className={`h-full rounded-full ${barTone}`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Recently added</h2>
              <p className="mt-1 text-xs text-muted">Latest products in your catalog.</p>
            </div>
            <Link to="/warehouse" className="text-xs font-medium text-power hover:underline">
              All products →
            </Link>
          </div>
          {isLoading ? (
            <p className="mt-5 text-sm text-muted" role="status">Loading products…</p>
          ) : activeProducts.length === 0 ? (
            <p className="mt-5 text-sm text-muted">No products yet. Use “Register item” to add your first SKU.</p>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {recentProducts.slice(0, 5).map((product) => (
                <div key={product.id ?? product.sku} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-muted">{product.sku} · {product.category}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-ink">{availableQty(product)} on hand</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="flex flex-col justify-between gap-5 border-power/20 bg-gradient-to-br from-power/10 via-surface to-online/5 p-5 sm:p-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-power">Next steps</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink">Keep the operation moving.</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              Register products, review reorder signals, or browse the storefront from one workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button as={Link} to="/warehouse">Open warehouse</Button>
            <Button as={Link} to="/purchasing" variant="secondary">Purchasing</Button>
            <Button as={Link} to="/storefront" variant="ghost">Storefront →</Button>
          </div>
        </Card>
      </div>

      <p className="mt-5 text-[11px] leading-relaxed text-muted">
        Snapshot note: quantities currently reflect the product API’s setup values. A live stock transaction ledger is planned separately and is not represented by these totals.
      </p>
    </main>
  )
}
