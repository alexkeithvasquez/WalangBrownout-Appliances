import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-24 text-center text-sm text-muted" role="status">
        Checking your session…
      </main>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
