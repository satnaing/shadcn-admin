import { useMutation, useQueryClient } from '@tanstack/react-query'
import { promotionsService } from '../data/promotions.service'
import {
  type CategoryDiscountItem,
  type CouponItem,
  type FlashDealItem,
} from '../data/promotions.type'

export function usePromotionMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-flash-deals'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-coupons'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-category-discounts'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-promotional-products'] })
  }

  const flashDealStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      promotionsService.toggleFlashDealStatus(id, status),
    onSuccess: invalidate,
  })

  const flashDealFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: number; featured: boolean }) =>
      promotionsService.toggleFlashDealFeatured(id, featured),
    onSuccess: invalidate,
  })

  const saveFlashDealMutation = useMutation({
    mutationFn: (p: Partial<FlashDealItem>) => promotionsService.saveFlashDeal(p),
    onSuccess: invalidate,
  })

  const deleteFlashDealMutation = useMutation({
    mutationFn: (id: number) => promotionsService.deleteFlashDeal(id),
    onSuccess: invalidate,
  })

  const couponStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      promotionsService.toggleCouponStatus(id, status),
    onSuccess: invalidate,
  })

  const saveCouponMutation = useMutation({
    mutationFn: (p: Partial<CouponItem>) => promotionsService.saveCoupon(p),
    onSuccess: invalidate,
  })

  const deleteCouponMutation = useMutation({
    mutationFn: (id: number) => promotionsService.deleteCoupon(id),
    onSuccess: invalidate,
  })

  const saveCategoryDiscountMutation = useMutation({
    mutationFn: (p: Partial<CategoryDiscountItem>) => promotionsService.saveCategoryDiscount(p),
    onSuccess: invalidate,
  })

  const deleteCategoryDiscountMutation = useMutation({
    mutationFn: (id: number) => promotionsService.deleteCategoryDiscount(id),
    onSuccess: invalidate,
  })

  return {
    flashDealStatusMutation,
    flashDealFeaturedMutation,
    saveFlashDealMutation,
    deleteFlashDealMutation,
    couponStatusMutation,
    saveCouponMutation,
    deleteCouponMutation,
    saveCategoryDiscountMutation,
    deleteCategoryDiscountMutation,
  }
}
