import { useQuery } from '@tanstack/react-query'
import { getPromotions } from '@/services/promotions'
import type { Promotion } from '@/types/growth'

export const usePromotions = () => {
  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: getPromotions,
  })
}
