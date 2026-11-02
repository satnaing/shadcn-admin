import { requestInstanceClient } from '@/config/api'
import type { WithData, WithPagination } from '@/shared/types'
import type { ProductFormData, ProductItem, ProductReviewItem } from './products.type'

export const productsService = {
  getList: (params?: Record<string, unknown>) =>
    requestInstanceClient.get<WithPagination<ProductItem[]>>('/admin/products', {
      params,
    }),

  getById: (id: number) =>
    requestInstanceClient.get<WithData<ProductItem>>(`/admin/products/${id}`),

  create: (data: ProductFormData) =>
    requestInstanceClient.post('/admin/products', data),

  update: (id: number, data: Partial<ProductFormData>) =>
    requestInstanceClient.put(`/admin/products/${id}`, data),

  delete: (id: number) =>
    requestInstanceClient.delete(`/admin/products/${id}`),

  updateStatus: (
    id: number,
    field: 'published' | 'featured' | 'todays_deal' | 'approved',
    value: boolean
  ) =>
    requestInstanceClient.patch(`/admin/products/${id}/status`, {
      field,
      value,
    }),

  getReviews: (params?: Record<string, unknown>) =>
    requestInstanceClient.get<WithPagination<ProductReviewItem[]>>(
      '/admin/products/reviews',
      { params }
    ),

  updateReviewStatus: (id: number, status: boolean) =>
    requestInstanceClient.patch(`/admin/products/reviews/${id}/status`, {
      status,
    }),

  deleteReview: (id: number) =>
    requestInstanceClient.delete(`/admin/products/reviews/${id}`),
}

export const productsKeys = {
  all: ['products'] as const,
  list: (params?: Record<string, unknown>) =>
    [...productsKeys.all, 'list', params] as const,
  detail: (id: number) => [...productsKeys.all, 'detail', id] as const,
  reviews: (params?: Record<string, unknown>) =>
    [...productsKeys.all, 'reviews', params] as const,
}
