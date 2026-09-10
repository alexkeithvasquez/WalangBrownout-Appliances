import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from './common/Card'
import Button from './common/Button'
import PageHeader from './common/PageHeader'
import { useAuth } from '../context/AuthContext'

const ACCOUNT_TYPES = [
  {
    value: 'customer',
    label: 'Customer',
    description: 'Browse products in the online storefront.',
  },
  {
    value: 'staff',
    label: 'Staff',
    description: 'Access purchasing, warehouse, and storefront modules.',
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Access operational modules and management reports.',
  },
]

const INPUT_CLASS =
  'w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-power disabled:opacity-60'

const LABEL_CLASS =
  'mb-1 block text-xs uppercase tracking-wider text-muted'

function EyeIcon({ visible }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
      aria-hidden="true"
    >
      {visible ? (
        <>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </>
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5 1.556 0 3.036-.338 4.368-.946M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      )}
    </svg>
  )
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  hint,
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          minLength={8}
          required
          disabled={disabled}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${INPUT_CLASS} pr-12`}
        />

        <button
          type="button"
          onClick={() => setVisible((previous) => !previous)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex items-center rounded-md px-3 text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-power disabled:opacity-60"
          aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`}
          aria-controls={id}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>

      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  )
}

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('customer')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signup } = useAuth()
  const navigate = useNavigate()

  const selectedAccountType = ACCOUNT_TYPES.find(
    (accountType) => accountType.value === role
  )

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting) return

    setError('')

    const cleanName = name.trim()
    const cleanEmail = email.trim()

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!ACCOUNT_TYPES.some((accountType) => accountType.value === role)) {
      setError('Please select a valid account type.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signup(
        cleanName,
        cleanEmail,
        password,
        role
      )

      if (!result?.ok) {
        setError(
          result?.error || 'Unable to create your account. Please try again.'
        )
        return
      }

      navigate('/', { replace: true })
    } catch {
      setError('Something went wrong while signing up. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-57px)] grid-cols-1 lg:grid-cols-2">
      {/* Image side */}
      <div className="relative hidden overflow-hidden border-r border-border lg:block">
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            backgroundImage: 'url("/login-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-bg/10" />

        <div className="relative flex h-full flex-col justify-end p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-power">
            Inventory Management System
          </p>

          <h2 className="mt-3 max-w-sm font-display text-2xl font-bold text-ink">
            One place for your team and customers.
          </h2>

          <p className="mt-3 max-w-sm text-sm text-muted">
            Create your account and choose the account type that fits you.
          </p>
        </div>
      </div>

      {/* Form side */}
      <div className="flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-md">
          <PageHeader
            eyebrow="Account"
            title="Sign up"
            subtitle="Create your WalangBrownout Appliances account."
          />

          <Card className="p-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              aria-busy={isSubmitting}
            >
              <div>
                <label htmlFor="signup-name" className={LABEL_CLASS}>
                  Full name
                </label>

                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ex. Juan Dela Cruz"
                  autoComplete="name"
                  required
                  disabled={isSubmitting}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="signup-email" className={LABEL_CLASS}>
                  Email
                </label>

                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  className={INPUT_CLASS}
                />
              </div>

              <div>
                <label htmlFor="signup-role" className={LABEL_CLASS}>
                  Account type
                </label>

                <select
                  id="signup-role"
                  name="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-describedby="signup-role-description"
                  className={INPUT_CLASS}
                >
                  {ACCOUNT_TYPES.map((accountType) => (
                    <option
                      key={accountType.value}
                      value={accountType.value}
                    >
                      {accountType.label}
                    </option>
                  ))}
                </select>

                <p
                  id="signup-role-description"
                  className="mt-2 text-xs text-muted"
                >
                  {selectedAccountType?.description}
                </p>
              </div>

              <PasswordField
                id="signup-password"
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                disabled={isSubmitting}
                hint="Use at least 8 characters."
              />

              <PasswordField
                id="signup-confirm-password"
                label="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter password"
                disabled={isSubmitting}
              />

              {error && (
                <p
                  role="alert"
                  className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-online hover:underline">
                Log in
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}