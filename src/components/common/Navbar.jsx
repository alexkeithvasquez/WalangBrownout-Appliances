import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  {
    to: "/purchasing",
    label: "Purchasing",
    roles: ["staff", "manager", "admin"],
  },
  {
    to: "/warehouse",
    label: "Warehouse",
    roles: ["staff", "manager", "admin"],
  },
  {
    to: "/storefront",
    label: "Storefront",
    roles: ["customer", "staff", "manager", "admin"],
  },
  { to: "/reporting", label: "Reporting", roles: ["manager", "admin"] },
  {
    to: "/orders",
    label: "My Orders",
    roles: ["customer", "staff", "manager", "admin"],
  },
];

function navLinkClass({ isActive }) {
  return `relative py-1 font-body text-sm transition-colors ${
    isActive
      ? "text-ink after:absolute after:-bottom-[21px] after:left-0 after:h-[2px] after:w-full after:bg-power"
      : "text-muted hover:text-ink"
  }`;
}

function Logo() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-power/10">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 text-power"
      >
        <path d="M13 2L3 14h6l-1 8 10-12h-6l1-8z" />
      </svg>
    </div>
  );
}

function UserDetails({ user }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm text-muted">
        Hi, <span className="text-ink">{user.name.split(" ")[0]}</span>
      </span>
      <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-[11px] font-medium capitalize text-power">
        {user.role}
      </span>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const visibleLinks = LINKS.filter((link) =>
    link.roles.includes(currentUser?.role),
  );

  function closeMenu() {
    setOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to={currentUser ? "/" : "/login"}
          className="flex items-center gap-2.5"
          onClick={closeMenu}
        >
          <span className="font-body text-sm">
            WalangBrownout Appliances
          </span>
        </Link>

        {currentUser && (
          <>
            {/* Desktop navigation */}
            <nav
              className="hidden items-center gap-8 md:flex"
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
            </nav>

            <div className="hidden items-center gap-4 border-l border-border pl-6 md:flex">
              <UserDetails user={currentUser} />
              <button
                type="button"
                onClick={handleLogout}
                className="whitespace-nowrap rounded-md px-2 py-1.5 text-sm text-danger transition-colors hover:bg-danger/10"
              >
                Log out
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-power md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
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
          className={`border-t border-border px-6 py-5 md:hidden ${open ? "block" : "hidden"}`}
          aria-label="Mobile modules"
        >
          <div className="flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-surface-2 text-ink"
                      : "text-muted hover:bg-surface-2 hover:text-ink"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <UserDetails user={currentUser} />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-2 py-1.5 text-sm text-danger transition-colors hover:bg-danger/10"
            >
              Log out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
