import { createContext, useEffect, useState, useCallback } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import { fetchUserDetails, setTokenProvider, setCurrentUserId, provisionUser } from '../services/api'

export const UserContext = createContext()

export function UserProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const { getToken, signOut } = useAuth()
  const [user, setUser] = useState(null)
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    setTokenProvider(getToken)
  }, [getToken])

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn && clerkUser) {
      const basicUser = {
        _id: clerkUser.id,
        id: clerkUser.id,
        fullname: clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress || "",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
        avatarSrc: clerkUser.imageUrl,
      }
      setUser(basicUser)
      setCurrentUserId(clerkUser.id)
      setUserLoading(false)

      fetchUserDetails()
        .then(resp => {
          if (resp.status !== "ok") {
            const email = clerkUser.primaryEmailAddress?.emailAddress || ""
            const fullname = clerkUser.fullName || email
            return provisionUser(fullname, email).then(() => fetchUserDetails())
          }
          return resp
        })
        .then(resp => {
          if (resp.status == "ok") {
            setUser({ ...resp.user, avatarSrc: clerkUser.imageUrl })
          }
        })
        .catch(e => console.error("provisioning error:", e))
    } else {
      setUser(null)
      setCurrentUserId(null)
      setUserLoading(false)
    }
  }, [isLoaded, isSignedIn, clerkUser])

  const logout = useCallback(() => {
    signOut()
    setUser(null)
    setCurrentUserId(null)
  }, [signOut])

  if (!isLoaded || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}
