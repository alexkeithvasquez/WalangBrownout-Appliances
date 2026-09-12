import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  {
    to: '/purchasing',
    label: 'Purchasing',
    roles: ['staff', 'manager', 'admin'],
  },
  {
    to: '/warehouse',
    label: 'Warehouse',
    roles: ['staff', 'manager', 'admin'],
  },
  {
    to: '/storefront',
    label: 'Storefront',
    roles: ['customer', 'staff', 'manager', 'admin'],
  },
  {
    to: '/reporting',
    label: 'Reporting',
    roles: ['manager', 'admin'],
  },
  {
  to: '/orders',
  label: 'My Orders',
  roles: ['customer', 'staff', 'manager', 'admin'],
},
]

function navLinkClass({ isActive }) {
  return `font-body text-sm transition-colors ${
    isActive ? 'text-ink' : 'text-muted hover:text-ink'
  }`
}

function UserDetails({ user }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted">
        Hi, {user.name}
      </span>

      <span className="rounded-md border border-border bg-surface-2 px-2 py-1 text-xs capitalize text-power">
        {user.role}
      </span>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const visibleLinks = LINKS.filter((link) =>
    link.roles.includes(currentUser?.role)
  )

  function closeMenu() {
    setOpen(false)
  }

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          to={currentUser ? '/' : '/login'}
          className="flex items-baseline gap-2"
          onClick={closeMenu}
        >
          <span className="font-body text-sm text-muted">
            WalangBrownout Appliances
          </span>
        </Link>

        {currentUser && (
          <>
            {/* Desktop navigation */}
            <nav
              className="hidden items-center gap-6 md:flex"
              aria-label="Modules"
            >
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="flex items-center gap-3 border-l border-border pl-6">
                <UserDetails user={currentUser} />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="whitespace-nowrap text-sm text-danger hover:underline"
                >
                  Log out
                </button>
              </div>
            </nav>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              className="flex items-center justify-center rounded-md border border-border p-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-power md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Mobile navigation */}
      {currentUser && (
        <nav
          id="mobile-navigation"
          className={`border-t border-border px-6 py-4 md:hidden ${
            open ? 'block' : 'hidden'
          }`}
          aria-label="Mobile modules"
        >
          <div className="flex flex-col gap-4">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4">
              <UserDetails user={currentUser} />

              <button
                type="button"
                onClick={handleLogout}
                className="text-left text-sm text-danger hover:underline"
              >
                Log out
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}