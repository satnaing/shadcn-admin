import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getLoyaltySettings,
  updateLoyaltySettings,
  getCustomerBalances,
} from '@/services/loyalty'
import type { LoyaltySettings } from '@/features/growth/data/loyalty-schema'

export const useLoyaltySettings = () => {
  return useQuery({
    queryKey: ['loyalty-settings'],
    queryFn: getLoyaltySettings,
  })
}

export const useUpdateLoyaltySettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LoyaltySettings) => updateLoyaltySettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty-settings'] })
    },
  })
}

export const useCustomerBalances = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['customer-balances', params],
    queryFn: () => getCustomerBalances(params),
  })
}
