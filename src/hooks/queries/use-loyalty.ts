import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getLoyaltySettings, updateLoyaltySettings } from '@/services/loyalty'
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
