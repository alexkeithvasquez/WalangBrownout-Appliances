import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_GROUPS = [
  {
    label: "Workspace",
    roles: ["staff", "admin"],
    links: [{ to: "/", label: "Overview" }],
  },
  {
    label: "Operations",
    roles: ["staff", "admin"],
    links: [
      { to: "/warehouse", label: "Warehouse" },
      { to: "/purchasing", label: "Purchasing" },
    ],
  },
  {
    label: "Commerce",
    roles: ["staff", "admin"],
    links: [
      { to: "/storefront", label: "Storefront" },
      { to: "/orders", label: "My Orders" },
    ],
  },
  {
    label: "Administration",
    roles: ["admin"],
    links: [{ to: "/reporting", label: "Reports" }],
  },
];

function navLinkClass({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-power ${
    isActive
      ? "bg-power/10 text-power"
      : "text-muted hover:bg-surface-2 hover:text-ink"
  }`;
}

function Logo() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-power/20 bg-power/10">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4 text-power"
        aria-hidden="true"
      >
        <path d="M13 2L3 14h6l-1 8 10-12h-6l1-8z" />
      </svg>
    </span>
  );
}

function UserDetails({ user }) {
  const firstName = user?.name?.trim().split(/\s+/)[0] || "User";

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
          Signed in as
        </p>
        <p className="text-sm font-medium text-ink">{firstName}</p>
      </div>
      <span className="rounded-md border border-border bg-surface-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-power">
        {user.role}
      </span>
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const visibleGroups = NAV_GROUPS.filter((group) =>
    group.roles.includes(currentUser?.role),
  );

  function closeMenu() {
    setOpen(false);
  }

  async function handleLogout() {
    await logout();
    closeMenu();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex min-h-[68px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to={currentUser ? "/" : "/login"}
          className="flex min-w-0 items-center gap-3"
          onClick={closeMenu}
        >
          <Logo />
          <span className="whitespace-nowrap font-display text-sm font-semibold text-ink sm:text-base">
            WalangBrownout <span className="text-muted">Appliances</span>
          </span>
        </Link>

        {currentUser && (
          <>
            <div className="hidden items-center gap-5 xl:flex">
              <UserDetails user={currentUser} />
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-border px-3 py-2 text-sm font-medium text-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-power"
              >
                Sign out
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-ink transition-colors hover:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-power xl:hidden"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="site-navigation"
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

      {currentUser && (
        <nav
          className="mx-auto hidden max-w-6xl items-end gap-5 border-t border-border px-6 py-3 xl:flex"
          aria-label="Main navigation"
        >
          {visibleGroups.map((group, index) => (
            <div
              key={group.label}
              className={`min-w-max ${index > 0 ? "border-l border-border pl-5" : ""}`}
            >
              <p className="mb-1 px-3 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                {group.label}
              </p>
              <div className="flex items-center gap-1">
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={navLinkClass}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      )}

      {currentUser && (
        <nav
          id="site-navigation"
          className={`border-t border-border px-4 py-4 sm:px-6 xl:hidden ${open ? "block" : "hidden"}`}
          aria-label="Main navigation"
        >
          <div className="mx-auto max-w-6xl space-y-4">
            {visibleGroups.map((group) => (
              <section key={group.label} aria-label={group.label}>
                <h2 className="mb-1 px-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {group.label}
                </h2>
                <div className="flex flex-col gap-1">
                  {group.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/"}
                      onClick={closeMenu}
                      className={navLinkClass}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </section>
            ))}

            <div className="flex items-center justify-between border-t border-border pt-4">
              <UserDetails user={currentUser} />
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-power"
              >
                Sign out
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
