import { useQuery } from '@tanstack/react-query'
import { promotionsService } from '../data/promotions.service'

export function useFlashDeals(params?: { search?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin-flash-deals', params],
    queryFn: () => promotionsService.getFlashDeals(params),
  })
}

export function useCoupons(params?: { search?: string; type?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin-coupons', params],
    queryFn: () => promotionsService.getCoupons(params),
  })
}

export function useCategoryDiscounts() {
  return useQuery({
    queryKey: ['admin-category-discounts'],
    queryFn: () => promotionsService.getCategoryDiscounts(),
  })
}

export function usePromotionalProducts(params?: { added_by?: 'all' | 'admin' | 'seller'; search?: string }) {
  return useQuery({
    queryKey: ['admin-promotional-products', params],
    queryFn: () => promotionsService.getPromotionalProducts(params),
  })
}

export { usePromotionMutations } from './usePromotionMutations'
