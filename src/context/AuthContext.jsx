import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const VALID_ROLES = ['customer', 'staff', 'manager', 'admin']
const SIGNUP_ROLES = ['customer', 'staff', 'manager']

const DEMO_USERS = [
  {
    name: 'Alex Keith Vasquez',
    email: 'manager@walangbrownout.ph',
    password: 'manager123',
    role: 'manager',
  },
  {
    name: 'Jenny Santos',
    email: 'staff@walangbrownout.ph',
    password: 'staff123',
    role: 'staff',
  },
  {
    name: 'Miguel Reyes',
    email: 'customer@gmail.com',
    password: 'customer123',
    role: 'customer',
  },
]

function seedDemoUsers() {
  const users = getUsers()
  const existingEmails = new Set(users.map((u) => normalizeEmail(u.email)))

  const missing = DEMO_USERS.filter(
    (demo) => !existingEmails.has(normalizeEmail(demo.email)),
  )

  if (missing.length > 0) {
    saveUsers([...users, ...missing])
  }
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function getUsers() {
  try {
    const users = JSON.parse(localStorage.getItem('wb_users') || '[]')
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem('wb_users', JSON.stringify(users))
}

function createSession(user) {
  return {
    name: user.name,
    email: user.email,
    role: VALID_ROLES.includes(user.role) ? user.role : 'customer',
  }
}

function getStoredSession() {
  try {
    const stored = JSON.parse(
      localStorage.getItem('wb_current_user') || 'null'
    )

    if (!stored?.email) return null

    const user = getUsers().find(
      (account) =>
        normalizeEmail(account.email) === normalizeEmail(stored.email)
    )

    return user ? createSession(user) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    seedDemoUsers()
    return getStoredSession()
  })

  function startSession(user) {
    const session = createSession(user)

    localStorage.setItem('wb_current_user', JSON.stringify(session))
    setCurrentUser(session)
  }

  function signup(name, email, password, role = 'customer') {
    const cleanName = name.trim()
    const cleanEmail = normalizeEmail(email)

    if (!cleanName || !cleanEmail || !password) {
      return {
        ok: false,
        error: 'Please fill in all fields.',
      }
    }

    if (password.length < 8) {
      return {
        ok: false,
        error: 'Your password must contain at least 8 characters.',
      }
    }

    if (!SIGNUP_ROLES.includes(role)) {
      return {
        ok: false,
        error: 'Please select a valid account type.',
      }
    }

    try {
      const users = getUsers()

      const emailExists = users.some(
        (user) => normalizeEmail(user.email) === cleanEmail
      )

      if (emailExists) {
        return {
          ok: false,
          error: 'An account with that email already exists.',
        }
      }

      // Demo only: immediately assigns the selected role.
      // In production, Staff/Manager roles must require backend approval.
      // Never store plaintext passwords in a production application.
      const newUser = {
        name: cleanName,
        email: cleanEmail,
        password,
        role,
      }

      saveUsers([...users, newUser])
      startSession(newUser)

      return { ok: true }
    } catch {
      return {
        ok: false,
        error: 'Unable to save your account. Check browser storage and try again.',
      }
    }
  }

  function login(email, password) {
    const cleanEmail = normalizeEmail(email)

    try {
      const found = getUsers().find(
        (user) =>
          normalizeEmail(user.email) === cleanEmail &&
          user.password === password
      )

      if (!found) {
        return {
          ok: false,
          error: 'Invalid email or password.',
        }
      }

      startSession(found)

      return { ok: true }
    } catch {
      return {
        ok: false,
        error: 'Unable to sign in. Please try again.',
      }
    }
  }

  function logout() {
    localStorage.removeItem('wb_current_user')
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }

  return context
}