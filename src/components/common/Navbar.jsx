import { Link, NavLink } from 'react-router-dom'
import Badge from './Badge'

const LINKS = [
  { to: '/purchasing', label: 'Purchasing' },
  { to: '/warehouse', label: 'Warehouse' },
  { to: '/storefront', label: 'Storefront' },
  { to: '/reporting', label: 'Reporting' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="hidden font-body text-sm text-muted sm:inline">
            WalangBrownout Appliances
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Modules">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-body text-sm transition-colors ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
