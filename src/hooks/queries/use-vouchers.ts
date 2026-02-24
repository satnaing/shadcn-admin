import { useQuery } from '@tanstack/react-query'
import * as vouchersService from '@/services/vouchers'

export const VOUCHERS_QUERY_KEY = ['vouchers']

export function useVouchers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...VOUCHERS_QUERY_KEY, params],
    queryFn: () => vouchersService.getVouchers(params),
  })
}
