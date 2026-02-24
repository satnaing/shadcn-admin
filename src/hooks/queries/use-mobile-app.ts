import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as mobileAppService from '@/services/mobile-app'
import { toast } from 'sonner'

export const MOBILE_VERSIONS_QUERY_KEY = ['mobile-versions']

export function useMobileVersions(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...MOBILE_VERSIONS_QUERY_KEY, params],
    queryFn: () => mobileAppService.getMobileVersions(params),
  })
}

export function useCreateMobileVersion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: mobileAppService.createMobileVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOBILE_VERSIONS_QUERY_KEY })
      toast.success('Mobile app version published successfully')
    },
    onError: (error: any) => {
      toast.error(
        'Failed to publish mobile version: ' +
          (error?.response?.data?.message || error.message)
      )
    },
  })
}

export function useUpdateMobileVersion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      mobileAppService.updateMobileVersion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOBILE_VERSIONS_QUERY_KEY })
      toast.success('Mobile app version updated successfully')
    },
    onError: (error: any) => {
      toast.error(
        'Failed to update mobile version: ' +
          (error?.response?.data?.message || error.message)
      )
    },
  })
}

export function useDeleteMobileVersion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: mobileAppService.deleteMobileVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOBILE_VERSIONS_QUERY_KEY })
      toast.success('Mobile app version deleted successfully')
    },
    onError: (error: any) => {
      toast.error(
        'Failed to delete mobile version: ' +
          (error?.response?.data?.message || error.message)
      )
    },
  })
}
