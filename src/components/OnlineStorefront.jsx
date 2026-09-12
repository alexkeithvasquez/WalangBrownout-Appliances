import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from './common/Card'
import Badge from './common/Badge'
import Button from './common/Button'
import PageHeader from './common/PageHeader'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../lib/orders'

const PRODUCTS = [
  {
    id: 'ac-12k',
    name: 'Portable AC 12k BTU',
    category: 'Air Conditioners',
    price: 18500,
    available: 12,
  },
  {
    id: 'therm-x',
    name: 'Smart Thermostat X',
    category: 'Thermostats',
    price: 4200,
    available: 2,
  },
  {
    id: 'filter-carbon',
    name: 'Carbon Air Filter',
    category: 'Filters',
    price: 650,
    available: 0,
  },
  {
    id: 'purifier-mini',
    name: 'Air Purifier Mini',
    category: 'Air Purifiers',
    price: 6900,
    available: 27,
  },
]

const CATEGORIES = ['Air Conditioners', 'Air Purifiers', 'Filters', 'Thermostats']

const PAY_METHODS = [
  { id: 'Cash on Delivery', desc: 'Pay when it arrives' },
  { id: 'GCash', desc: 'Instant e-wallet payment' },
  { id: 'Card', desc: 'Visa / Mastercard / BancNet' },
]

function peso(n) {
  return `₱${Number(n || 0).toLocaleString('en-PH')}`
}

function stockInfo(available) {
  if (available === 0) return { text: 'Out of stock', status: 'danger' }
  if (available <= 2) return { text: `Only ${available} left`, status: 'standby' }
  return { text: `${available} available`, status: 'online' }
}

export default function OnlineStorefront() {
  const { currentUser } = useAuth()

  const [query, setQuery] = useState('')
  const [activeCategories, setActiveCategories] = useState([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [cart, setCart] = useState({}) // id -> qty
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [payment, setPayment] = useState('Cash on Delivery')
  const [placedOrder, setPlacedOrder] = useState(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return PRODUCTS.filter((p) => {
      if (activeCategories.length && !activeCategories.includes(p.category)) return false
      if (inStockOnly && p.available === 0) return false
      if (needle && !p.name.toLowerCase().includes(needle)) return false
      return true
    })
  }, [query, activeCategories, inStockOnly])

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const product = PRODUCTS.find((p) => p.id === id)
          return product ? { ...product, qty } : null
        })
        .filter(Boolean),
    [cart],
  )

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)

  function toggleCategory(cat) {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  function addToCart(product) {
    const inCart = cart[product.id] || 0
    if (inCart >= product.available) return
    setCart((prev) => ({ ...prev, [product.id]: inCart + 1 }))
    setDrawerOpen(true)
  }

  function setQty(id, qty) {
    const product = PRODUCTS.find((p) => p.id === id)
    if (qty <= 0) {
      setCart((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      return
    }
    if (product && qty > product.available) return
    setCart((prev) => ({ ...prev, [id]: qty }))
  }

  function placeOrder() {
    const order = createOrder({
      customerEmail: currentUser.email,
      customerName: currentUser.name,
      items: cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      payment,
    })
    setPlacedOrder(order)
    setCart({})
  }

  function closeCheckout() {
    setCheckoutOpen(false)
    setPlacedOrder(null)
    setDrawerOpen(false)
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <PageHeader eyebrow="MOD-03 · Storefront" title="Online Storefront" />
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink hover:border-power/50"
        >
          Cart <span className="ml-1 font-mono text-power">{cartCount}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          <div>
            <p className="mb-3 text-xs uppercase tracking-wider text-muted">Search</p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-power"
            />
          </div>

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

          <Link to="/orders" className="block text-sm text-online hover:underline">
            View my orders →
          </Link>
        </aside>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const stock = stockInfo(p.available)
            const inCart = cart[p.id] || 0
            return (
              <Card key={p.id} className="flex flex-col p-5">
                <div className="mb-4 flex h-28 items-center justify-center rounded-md border border-border bg-surface-2 px-3 text-center font-mono text-xs text-muted">
                  {p.name}
                </div>
                <h3 className="font-display text-base font-semibold text-ink">{p.name}</h3>
                <p className="mt-1 font-mono text-sm text-ink">{peso(p.price)}</p>
                <div className="mt-2">
                  <Badge status={stock.status}>{stock.text}</Badge>
                </div>
                <Button
                  variant={p.available === 0 ? 'ghost' : 'primary'}
                  className="mt-4"
                  disabled={p.available === 0}
                  onClick={() => addToCart(p)}
                >
                  {p.available === 0
                    ? 'Notify me'
                    : inCart > 0
                      ? `In cart (${inCart})`
                      : 'Add to cart'}
                </Button>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Cart drawer */}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-border bg-bg shadow-2xl transition-transform duration-200 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="font-display text-sm font-semibold text-ink">
              Your cart {cartCount > 0 && <span className="font-mono text-power">({cartCount})</span>}
            </span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="text-muted hover:text-ink"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {cartItems.length === 0 ? (
              <p className="mt-8 text-center text-sm text-muted">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-border bg-surface-2 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-ink">{item.name}</span>
                      <button
                        type="button"
                        onClick={() => setQty(item.id, 0)}
                        className="text-xs text-danger hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="h-7 w-7 rounded border border-border text-ink hover:bg-surface"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-mono text-sm text-ink">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          disabled={item.qty >= item.available}
                          className="h-7 w-7 rounded border border-border text-ink hover:bg-surface disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-mono text-sm text-ink">
                        {peso(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t border-border px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted">Total</span>
                <span className="font-display text-lg font-semibold text-ink">
                  {peso(cartTotal)}
                </span>
              </div>
              <Button variant="primary" className="w-full" onClick={() => setCheckoutOpen(true)}>
                Checkout
              </Button>
            </div>
          )}
        </aside>
      </div>

      {/* Checkout modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60" onClick={closeCheckout} />
          <Card className="relative w-full max-w-md p-6">
            {placedOrder ? (
              <div className="text-center">
                <Badge status="online" pulse>
                  Order confirmed
                </Badge>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  Salamat, {currentUser.name.split(' ')[0]}!
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Order <span className="font-mono text-ink">{placedOrder.code}</span> ·{' '}
                  {peso(placedOrder.total)} via {placedOrder.payment}.
                </p>
                <Link to="/orders">
                  <Button variant="primary" className="mt-6 w-full" onClick={closeCheckout}>
                    Track my order
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <h3 className="font-display text-lg font-semibold text-ink">Checkout</h3>
                <p className="mt-1 text-xs text-muted">
                  {cartCount} items · {peso(cartTotal)}
                </p>

                <div className="mt-4 max-h-40 space-y-2 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted">
                        ×{item.qty} {item.name}
                      </span>
                      <span className="font-mono text-ink">{peso(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-5 mb-2 text-xs uppercase tracking-wider text-muted">
                  Payment method
                </p>
                <div className="space-y-2">
                  {PAY_METHODS.map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPayment(pm.id)}
                      className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                        payment === pm.id
                          ? 'border-power bg-power/10 text-ink'
                          : 'border-border bg-surface-2 text-muted hover:text-ink'
                      }`}
                    >
                      <span className="block font-medium text-ink">{pm.id}</span>
                      <span className="text-xs text-muted">{pm.desc}</span>
                    </button>
                  ))}
                </div>

                <Button variant="primary" className="mt-5 w-full" onClick={placeOrder}>
                  Place order · {peso(cartTotal)}
                </Button>
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="mt-2 w-full text-center text-xs text-muted hover:text-ink"
                >
                  Cancel
                </button>
              </>
            )}
          </Card>
        </div>
      )}
    </main>
  )
}