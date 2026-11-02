import { requestInstanceClient } from '@/config/api'
import type { WithPagination } from '@/shared/types'
import type { UnitFormData, UnitItem } from './units.type'

export const unitsService = {
  getList: (params?: Record<string, unknown>) =>
    requestInstanceClient.get<WithPagination<UnitItem[]>>('/admin/units', {
      params,
    }),

  create: (data: UnitFormData) =>
    requestInstanceClient.post('/admin/units', data),

  update: (id: number, data: Partial<UnitFormData>) =>
    requestInstanceClient.put(`/admin/units/${id}`, data),

  delete: (id: number) =>
    requestInstanceClient.delete(`/admin/units/${id}`),
}

export const unitsKeys = {
  all: ['units'] as const,
  list: (params?: Record<string, unknown>) =>
    [...unitsKeys.all, 'list', params] as const,
}
