import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as rolesService from '@/services/roles'
import { toast } from 'sonner'

export const ROLES_QUERY_KEY = ['roles']
export const PERMISSIONS_QUERY_KEY = ['permissions']

export function useRoles(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...ROLES_QUERY_KEY, params],
    queryFn: () => rolesService.getRoles(params),
  })
}

export function usePermissions() {
  return useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: () => rolesService.getPermissions(),
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rolesService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY })
      toast.success('Role created successfully')
    },
    onError: (error: any) => {
      toast.error(
        'Failed to create role: ' +
          (error?.response?.data?.message || error.message)
      )
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      rolesService.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY })
      toast.success('Role updated successfully')
    },
    onError: (error: any) => {
      toast.error(
        'Failed to update role: ' +
          (error?.response?.data?.message || error.message)
      )
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rolesService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY })
      toast.success('Role deleted successfully')
    },
    onError: (error: any) => {
      toast.error(
        'Failed to delete role: ' +
          (error?.response?.data?.message || error.message)
      )
    },
  })
}
