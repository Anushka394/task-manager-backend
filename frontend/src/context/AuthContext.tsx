import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AuthResponse } from '../types'

interface AuthUser {
  email: string
  name: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  saveAuth: (res: AuthResponse) => void
  clearAuth: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const loadUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))

  const saveAuth = useCallback((res: AuthResponse) => {
    localStorage.setItem('token', res.token)
    localStorage.setItem('user', JSON.stringify({ email: res.email, name: res.name }))
    setToken(res.token)
    setUser({ email: res.email, name: res.name })
  }, [])

  const clearAuth = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, saveAuth, clearAuth, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
