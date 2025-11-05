/**
 * React Query hooks for user management
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersApi, type UIUser, type UsersListParams } from '@/lib/api/users'

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UsersListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

/**
 * Hook to fetch paginated list of users
 */
export function useUsers(params?: UsersListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.list(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success('User created successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create user'
      toast.error(message)
    },
  })
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UIUser> }) =>
      usersApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) })
      toast.success('User updated successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update user'
      toast.error(message)
    },
  })
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success('User deleted successfully')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete user'
      toast.error(message)
    },
  })
}

/**
 * Hook to delete multiple users
 */
export function useDeleteUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => usersApi.delete(id)))
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast.success(`${ids.length} user(s) deleted successfully`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete users'
      toast.error(message)
    },
  })
}
