import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const demoUser = {
  _id: 'demo-admin',
  name: 'FoodBridge Demo',
  email: 'admin@foodbridge.demo',
  role: 'ADMIN'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => demoUser)
  const [token, setToken] = useState(() => localStorage.getItem('foodbridge_token') || 'demo-token')
  const [loading, setLoading] = useState(false)

  async function login(credentials) {
    const nextUser = { ...demoUser, email: credentials.email || demoUser.email, name: 'Demo User' }
    localStorage.setItem('foodbridge_token', 'demo-token')
    localStorage.setItem('foodbridge_role', nextUser.role)
    setToken('demo-token')
    setUser(nextUser)
    return { message: 'Demo login active', data: { user: nextUser, token: 'demo-token' } }
  }

  async function register(payload) {
    const nextUser = { ...demoUser, name: payload.name || demoUser.name, email: payload.email || demoUser.email }
    localStorage.setItem('foodbridge_token', 'demo-token')
    localStorage.setItem('foodbridge_role', nextUser.role)
    setToken('demo-token')
    setUser(nextUser)
    return { message: 'Demo account active', data: { user: nextUser, token: 'demo-token' } }
  }

  function logout() {
    localStorage.setItem('foodbridge_token', 'demo-token')
    localStorage.removeItem('foodbridge_role')
    setToken('demo-token')
    setUser(demoUser)
  }

  const value = useMemo(() => ({ user, token, loading, login, register, logout, setUser }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
