import { requestInstanceClient } from '@/config/api'
import type { WithPagination } from '@/shared/types'
import type { ColorFormData, ColorItem } from './colors.type'

export const colorsService = {
  getList: (params?: Record<string, unknown>) =>
    requestInstanceClient.get<WithPagination<ColorItem[]>>('/admin/colors', {
      params,
    }),

  create: (data: ColorFormData) =>
    requestInstanceClient.post('/admin/colors', data),

  update: (id: number, data: Partial<ColorFormData>) =>
    requestInstanceClient.put(`/admin/colors/${id}`, data),

  delete: (id: number) =>
    requestInstanceClient.delete(`/admin/colors/${id}`),
}

export const colorsKeys = {
  all: ['colors'] as const,
  list: (params?: Record<string, unknown>) =>
    [...colorsKeys.all, 'list', params] as const,
}
