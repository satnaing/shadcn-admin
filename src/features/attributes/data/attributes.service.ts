import { requestInstanceClient } from '@/config/api'
import type { WithPagination } from '@/shared/types'
import type { AttributeFormData, AttributeItem } from './attributes.type'

export const attributesService = {
  getList: (params?: Record<string, unknown>) =>
    requestInstanceClient.get<WithPagination<AttributeItem[]>>('/admin/attributes', {
      params,
    }),

  create: (data: AttributeFormData) =>
    requestInstanceClient.post('/admin/attributes', data),

  update: (id: number, data: Partial<AttributeFormData>) =>
    requestInstanceClient.put(`/admin/attributes/${id}`, data),

  delete: (id: number) =>
    requestInstanceClient.delete(`/admin/attributes/${id}`),
}

export const attributesKeys = {
  all: ['attributes'] as const,
  list: (params?: Record<string, unknown>) =>
    [...attributesKeys.all, 'list', params] as const,
}
