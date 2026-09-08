import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from './common/Card'
import Button from './common/Button'
import PageHeader from './common/PageHeader'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in both fields.')
      return
    }
    const result = login(email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/')
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <PageHeader eyebrow="Account" title="Log in" subtitle="Access your inventory dashboard." />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-power"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-muted">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-power"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" variant="primary" className="w-full">
            Log in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="text-online hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </main>
  )
}