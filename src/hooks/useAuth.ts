import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api, { setAuthToken, initAuthFromStorage } from '@/lib/api'

interface User {
  id: string
  email: string
  fullName?: string
  name?: string
}

interface AuthState {
  isAdmin: boolean
  loading: boolean
  user: User | null
  login: (email: string, password: string, isAdmin?: boolean) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const useAuthState = (): AuthState => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // Check if there's a stored token on mount and validate it
  useEffect(() => {
    const initAuth = async () => {
      try {
        initAuthFromStorage()
        const token = localStorage.getItem('authToken')
        
        if (!token) {
          setLoading(false)
          return
        }

        // Validate token by calling /auth/me
        const response = await api.get('/auth/me')
        if (response.data.role === 'admin' && response.data.admin) {
          setIsAdmin(true)
          setUser({
            id: response.data.admin.id,
            email: response.data.admin.email,
            fullName: response.data.admin.name
          })
        } else if (response.data.role === 'user' && response.data.user) {
          setIsAdmin(false)
          setUser({
            id: response.data.user.id,
            email: response.data.user.email,
            fullName: response.data.user.fullName
          })
        }
      } catch (error) {
        // Token is invalid or expired, clear it
        console.error('Auth validation failed:', error)
        localStorage.removeItem('authToken')
        setAuthToken(null)
        setIsAdmin(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Login with backend endpoint
  const login = useCallback(async (email: string, password: string, isAdminLogin: boolean = false): Promise<boolean> => {
    setLoading(true)
    try {
      const endpoint = isAdminLogin ? '/auth/admin/login' : '/auth/login'
      const response = await api.post(endpoint, { email, password })
      
      const { token, user: userData, admin: adminData } = response.data
      const userInfo = userData || adminData

      if (token && userInfo) {
        // Store token in localStorage
        localStorage.setItem('authToken', token)
        setAuthToken(token)

        setUser({
          id: userInfo.id,
          email: userInfo.email,
          fullName: userInfo.fullName || userInfo.name
        })

        // Determine admin status from response (prefer response content over caller flag)
        if (adminData) setIsAdmin(true)
        else if (userData) setIsAdmin(false)
        else setIsAdmin(isAdminLogin)

        setLoading(false)
        return !!adminData
      }

      setLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      return false
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    setUser(null)
    setIsAdmin(false)
    localStorage.removeItem('authToken')
    setAuthToken(null)
  }, [])

  return {
    isAdmin,
    loading,
    user,
    login,
    logout
  }
}