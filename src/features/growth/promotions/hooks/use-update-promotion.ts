import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePromotion } from '@/services/promotions'
import type { CreatePromotionDto } from '../types'

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: { id: string; data: Partial<CreatePromotionDto> }) =>
      updatePromotion(args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
}
