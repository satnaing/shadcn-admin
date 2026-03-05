import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as staffService from '@/services/staff'
import { toast } from 'sonner'

export const STAFF_QUERY_KEY = ['staff']

export function useStaff(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...STAFF_QUERY_KEY, params],
    queryFn: () => staffService.getStaffList(params),
  })
}

export function useCreateStaff() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: staffService.createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY })
      toast.success('Staff member created successfully')
    },
    onError: (error) => {
      toast.error('Failed to create staff member: ' + error.message)
    },
  })
}

export function useAssignShopAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      staffId,
      shopId,
      roleId,
    }: {
      staffId: string
      shopId: string
      roleId: string
    }) => staffService.assignShopAccess(staffId, { shopId, roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY })
      toast.success('Shop access assigned successfully')
    },
    onError: (error) => {
      toast.error('Failed to assign shop access: ' + error.message)
    },
  })
}

export function useRemoveShopAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ staffId, shopId }: { staffId: string; shopId: string }) =>
      staffService.removeShopAccess(staffId, shopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY })
      toast.success('Shop access removed successfully')
    },
    onError: (error) => {
      toast.error('Failed to remove shop access: ' + error.message)
    },
  })
}
