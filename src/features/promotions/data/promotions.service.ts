import { requestInstanceClient } from '@/config/api'
import { type WithPagination } from '@/shared/types'
import {
  type CategoryDiscountItem,
  type CouponItem,
  type FlashDealItem,
  type PromotionalProductItem,
} from './promotions.type'

export const promotionsService = {
  getFlashDeals(params?: { search?: string; page?: number }) {
    return requestInstanceClient.get<WithPagination<FlashDealItem[]>>('/admin/promotions/flash-deals', { params })
  },
  toggleFlashDealStatus(id: number | string, status: boolean) {
    return requestInstanceClient.patch(`/admin/promotions/flash-deals/${id}/status`, { status })
  },
  toggleFlashDealFeatured(id: number | string, featured: boolean) {
    return requestInstanceClient.patch(`/admin/promotions/flash-deals/${id}/featured`, { featured })
  },
  saveFlashDeal(payload: Partial<FlashDealItem>) {
    return payload.id
      ? requestInstanceClient.put(`/admin/promotions/flash-deals/${payload.id}`, payload)
      : requestInstanceClient.post('/admin/promotions/flash-deals', payload)
  },
  deleteFlashDeal(id: number | string) {
    return requestInstanceClient.delete(`/admin/promotions/flash-deals/${id}`)
  },
  getCoupons(params?: { search?: string; type?: string; page?: number }) {
    return requestInstanceClient.get<WithPagination<CouponItem[]>>('/admin/promotions/coupons', { params })
  },
  saveCoupon(payload: Partial<CouponItem>) {
    return payload.id
      ? requestInstanceClient.put(`/admin/promotions/coupons/${payload.id}`, payload)
      : requestInstanceClient.post('/admin/promotions/coupons', payload)
  },
  toggleCouponStatus(id: number | string, status: boolean) {
    return requestInstanceClient.patch(`/admin/promotions/coupons/${id}/status`, { status })
  },
  deleteCoupon(id: number | string) {
    return requestInstanceClient.delete(`/admin/promotions/coupons/${id}`)
  },
  getCategoryDiscounts() {
    return requestInstanceClient.get<{ data: CategoryDiscountItem[] }>('/admin/promotions/category-discounts')
  },
  saveCategoryDiscount(payload: Partial<CategoryDiscountItem>) {
    return requestInstanceClient.post('/admin/promotions/category-discounts', payload)
  },
  deleteCategoryDiscount(id: number | string) {
    return requestInstanceClient.delete(`/admin/promotions/category-discounts/${id}`)
  },
  getPromotionalProducts(params?: { added_by?: 'all' | 'admin' | 'seller'; search?: string }) {
    return requestInstanceClient.get<WithPagination<PromotionalProductItem[]>>('/admin/promotions/products', { params })
  },
}
