import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import axiosClient from '@/api/axiosClient'

export function useAuth() {
  const { auth } = useAuthStore()

  useEffect(() => {
    // Validate session on app load
    const validateSession = async () => {
      try {
        const response = await axiosClient.get('/auth/me')
        auth.setUser(response.data.user)
      } catch (error) {
        // Session invalid, clear user state
        auth.reset()
      }
    }

    if (!auth.user) {
      validateSession()
    }
  }, [auth])

  return {
    user: auth.user,
    isAuthenticated: !!auth.user,
    logout: auth.reset
  }
}