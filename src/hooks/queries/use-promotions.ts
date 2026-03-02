import { useQuery } from '@tanstack/react-query'
import * as promotionsService from '@/services/promotions'

export const PROMOTIONS_QUERY_KEY = ['promotions']

export function usePromotions() {
  return useQuery({
    queryKey: PROMOTIONS_QUERY_KEY,
    queryFn: () => promotionsService.getPromotions(),
  })
}
