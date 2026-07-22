import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import * as api from '@/services/adminApi'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const { getToken, signOut } = useAuth()
  const [admin, setAdmin] = useState(null)
  const [adminLoading, setAdminLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.setTokenProvider(getToken)
  }, [getToken])

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn || !clerkUser) {
      setAdmin(null)
      setAdminLoading(false)
      return
    }
    ;(async () => {
      try {
        const resp = await api.getUser(clerkUser.id)
        if (resp.status === 'error' || !resp.isAdmin) {
          setError('Access denied. Admin privileges required.')
          setAdmin(null)
        } else {
          setAdmin({ ...resp, avatarSrc: clerkUser.imageUrl })
          setError(null)
        }
      } catch {
        setError('Failed to verify admin access.')
        setAdmin(null)
      }
      setAdminLoading(false)
    })()
  }, [isLoaded, isSignedIn, clerkUser])

  const logout = useCallback(() => {
    signOut()
    setAdmin(null)
  }, [signOut])

  return (
    <AuthContext.Provider value={{ admin, adminLoading, error, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
