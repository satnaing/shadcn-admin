import { requestInstanceClient } from '@/config/api'
import type { WithData, WithPagination } from '@/shared/types'
import type { CategoryFormData, CategoryItem } from './categories.type'

export const categoriesService = {
  getList: (params?: Record<string, unknown>) =>
    requestInstanceClient.get<WithPagination<CategoryItem[]>>('/admin/categories', {
      params,
    }),

  getAll: () =>
    requestInstanceClient.get<WithData<CategoryItem[]>>('/admin/categories/all'),

  create: (data: CategoryFormData) =>
    requestInstanceClient.post('/admin/categories', data),

  update: (id: number, data: Partial<CategoryFormData>) =>
    requestInstanceClient.put(`/admin/categories/${id}`, data),

  delete: (id: number) =>
    requestInstanceClient.delete(`/admin/categories/${id}`),
}

export const categoriesKeys = {
  all: ['categories'] as const,
  list: (params?: Record<string, unknown>) =>
    [...categoriesKeys.all, 'list', params] as const,
  options: () => [...categoriesKeys.all, 'options'] as const,
}
