import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { useAuthStore } from '@/features/auth/data/auth.store'
import { userService } from '../data/user.service'

export const useCurrentUser = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)
  const setPermissions = usePermissionStore((state) => state.setPermissions)

  const { data: response, isLoading, isError } = useQuery({
    queryFn: userService.currentUser,
    queryKey: ['CURRENT_USER'],
    retry: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!accessToken,
  })

  useEffect(() => {
    if (response) {
      const { permissions, ...user } = response.data
      setUser(user)
      setPermissions(permissions)

      return
    }

    // No token, or the lookup failed: the answer is "none", and it is final.
    // Leaving the store in its loading state would hang every guarded page on
    // a blank screen instead of showing 403 or bouncing to login.
    if (!accessToken || isError) {
      setPermissions([])
    }
  }, [response, isError, accessToken, setUser, setPermissions])

  return {
    response,
    isLoading: isLoading,
  }
}
