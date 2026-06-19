import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import api from '@/lib/api'
import type { LoginCredentials, User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/v1/auth/me')
      setUser(data.data || data)
    } catch {
      localStorage.removeItem('auth_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [fetchUser])

  const login = async (credentials: LoginCredentials) => {
    const { data } = await api.post('/v1/auth/login', credentials)
    localStorage.setItem('auth_token', data.token || data.data?.token)
    setUser(data.user || data.data?.user)
  }

  const logout = () => {
    api.post('/v1/auth/logout').catch(() => {})
    localStorage.removeItem('auth_token')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}