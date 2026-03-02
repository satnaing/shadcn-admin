import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as promotionsService from '@/services/promotions'
import * as vouchersService from '@/services/vouchers'
import { toast } from 'sonner'

export const VOUCHERS_QUERY_KEY = ['vouchers']

export function useVouchers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...VOUCHERS_QUERY_KEY, params],
    queryFn: () => vouchersService.getVouchers(params),
  })
}

export function useGenerateVouchers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: promotionsService.generateVouchers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOUCHERS_QUERY_KEY })
      toast.success('Vouchers generated successfully')
    },
    onError: (error: any) => {
      toast.error(
        (error as any)?.response?.data?.message || 'Failed to generate vouchers'
      )
    },
  })
}
