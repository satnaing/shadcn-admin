import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPromotion } from '@/services/promotions'
import type { CreatePromotionDto } from '../types'

export const useCreatePromotion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePromotionDto) => createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
}
