import { Link, NavLink } from 'react-router-dom'
import Badge from './Badge'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to: '/purchasing', label: 'Purchasing' },
  { to: '/warehouse', label: 'Warehouse' },
  { to: '/storefront', label: 'Storefront' },
  { to: '/reporting', label: 'Reporting' },
]

export default function Navbar() {
  const { currentUser, logout } = useAuth()

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

          {currentUser ? (
            <div className="flex items-center gap-3 border-l border-border pl-6">
              <span className="text-sm text-muted">Hi, {currentUser.name}</span>
              <button
                onClick={logout}
                className="text-sm text-danger hover:underline"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-border pl-6">
              <Link to="/login" className="text-sm text-muted hover:text-ink">
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-power px-3 py-1.5 text-sm font-medium text-bg hover:bg-power/90"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}