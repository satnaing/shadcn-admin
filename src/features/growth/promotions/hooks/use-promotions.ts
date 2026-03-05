import { useQuery } from '@tanstack/react-query'
import { getPromotions } from '@/services/promotions'

export const usePromotions = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['promotions', params],
    queryFn: () => getPromotions(params),
  })
}
