import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ADMIN_USER = 'Admin'
const ADMIN_PASS = '9121751697'
const SESSION_KEY = 'groceria_admin_session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      return localStorage.getItem(SESSION_KEY) === '1'
    } catch {
      return false
    }
  })

  const login = useCallback((username, password) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(SESSION_KEY, '1')
      setAdmin(true)
      return { ok: true }
    }
    return { ok: false, error: 'Invalid credentials' }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setAdmin(false)
  }, [])

  const value = useMemo(
    () => ({ admin, login, logout }),
    [admin, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
