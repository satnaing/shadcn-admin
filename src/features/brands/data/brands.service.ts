import { requestInstanceClient } from '@/config/api'
import type { WithPagination } from '@/shared/types'
import type { BrandFormData, BrandItem } from './brands.type'

export const brandsService = {
  getList: (params?: Record<string, unknown>) =>
    requestInstanceClient.get<WithPagination<BrandItem[]>>('/admin/brands', {
      params,
    }),

  create: (data: BrandFormData) =>
    requestInstanceClient.post('/admin/brands', data),

  update: (id: number, data: Partial<BrandFormData>) =>
    requestInstanceClient.put(`/admin/brands/${id}`, data),

  delete: (id: number) =>
    requestInstanceClient.delete(`/admin/brands/${id}`),
}

export const brandsKeys = {
  all: ['brands'] as const,
  list: (params?: Record<string, unknown>) =>
    [...brandsKeys.all, 'list', params] as const,
}
