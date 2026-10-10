import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest, TOKEN_KEY, USER_KEY } from '../lib/api'

const AuthContext = createContext(null)

function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function storeSession(payload) {
  localStorage.setItem(TOKEN_KEY, payload.token)
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
  return payload.user
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        if (active) setIsLoading(false)
        return
      }

      try {
        const response = await apiRequest('/auth/user')
        if (active) {
          setCurrentUser(response.data)
          localStorage.setItem(USER_KEY, JSON.stringify(response.data))
        }
      } catch {
        clearStoredSession()
        if (active) setCurrentUser(null)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    restoreSession()
    return () => {
      active = false
    }
  }, [])

  async function signup(name, email, password) {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: {
          name,
          email,
          password,
          password_confirmation: password,
          device_name: 'walangbrownout-web',
        },
        auth: false,
      })
      setCurrentUser(storeSession(response))
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  async function login(email, password) {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password, device_name: 'walangbrownout-web' },
        auth: false,
      })
      setCurrentUser(storeSession(response))
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  async function logout() {
    try {
      if (localStorage.getItem(TOKEN_KEY)) {
        await apiRequest('/auth/logout', { method: 'POST' })
      }
    } catch {
      // Always clear the client session if the API is unavailable or the token expired.
    } finally {
      clearStoredSession()
      setCurrentUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
}
