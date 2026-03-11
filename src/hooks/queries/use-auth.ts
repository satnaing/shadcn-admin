import { type AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  login,
  logout,
  getSessions,
  revokeSession,
  type StaffLoginDto,
} from '@/services/auth'
import { toast } from 'sonner'

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: StaffLoginDto) => login(data),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('currentSessionId', data.sessionId)
      localStorage.setItem('currentUser', JSON.stringify(data.user))

      toast.success('Welcome back!', {
        description: `Logged in as ${data.user.username}`,
      })

      window.location.href = '/'
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error('Login Failed', {
        description:
          error.response?.data?.message || 'Invalid username or password',
      })
    },
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refreshToken') ?? ''
      return logout(refreshToken)
    },
    onSettled: () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('currentSessionId')
      localStorage.removeItem('activeShopId')
      localStorage.removeItem('currentUser')
      window.location.href = '/login'
    },
  })
}

export const useSessions = () => {
  return useQuery({
    queryKey: ['staff-sessions'],
    queryFn: getSessions,
  })
}

export const useRevokeSession = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-sessions'] })
      toast.success('Session revoked')
    },
    onError: () => {
      toast.error('Failed to revoke session')
    },
  })
}
