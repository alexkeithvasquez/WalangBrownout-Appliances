import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { to: '/purchasing', label: 'Purchasing' },
  { to: '/warehouse', label: 'Warehouse' },
  { to: '/storefront', label: 'Storefront' },
  { to: '/reporting', label: 'Reporting' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { currentUser, logout } = useAuth()

  function closeMenu() {
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-baseline gap-2" onClick={closeMenu}>
          <span className="font-body text-sm text-muted">
            WalangBrownout Appliances
          </span>
        </Link>

        {/* Desktop nav */}
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
              <button onClick={logout} className="text-sm text-danger hover:underline">
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

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center rounded-md border border-border p-2 text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="border-t border-border px-6 py-4 md:hidden" aria-label="Modules">
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `font-body text-sm transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4">
              {currentUser ? (
                <>
                  <span className="text-sm text-muted">Hi, {currentUser.name}</span>
                  <button
                    onClick={() => {
                      logout()
                      closeMenu()
                    }}
                    className="text-left text-sm text-danger hover:underline"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={closeMenu} className="text-sm text-muted hover:text-ink">
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="inline-block w-fit rounded-md bg-power px-3 py-1.5 text-sm font-medium text-bg hover:bg-power/90"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}