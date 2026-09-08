import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function getUsers() {
  return JSON.parse(localStorage.getItem('wb_users') || '[]')
}

function saveUsers(users) {
  localStorage.setItem('wb_users', JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('wb_current_user')
    return stored ? JSON.parse(stored) : null
  })

  function signup(name, email, password) {
    const users = getUsers()
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: 'An account with that email already exists.' }
    }
    const newUser = { name, email, password }
    saveUsers([...users, newUser])
    const session = { name, email }
    localStorage.setItem('wb_current_user', JSON.stringify(session))
    setCurrentUser(session)
    return { ok: true }
  }

  function login(email, password) {
    const users = getUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    const session = { name: found.name, email: found.email }
    localStorage.setItem('wb_current_user', JSON.stringify(session))
    setCurrentUser(session)
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem('wb_current_user')
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}