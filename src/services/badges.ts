import { type PaginationMeta } from '@/types/api'
import { apiClient } from '@/lib/api-client'
import { type Badge } from '@/features/menu/data/badge-schema'

export const getBadges = async (
  params?: Record<string, unknown>
): Promise<{ data: Badge[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/badges', { params })
  return {
    data: response.data?.items ?? response.data?.data ?? [],
    meta: response.data?.meta ?? {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  }
}

export const createBadge = async (data: Omit<Badge, 'id'>): Promise<Badge> => {
  const response = await apiClient.post('/admin/badges', data)
  return response.data
}

export const updateBadge = async (
  id: string,
  data: Partial<Badge>
): Promise<Badge> => {
  const response = await apiClient.patch(`/admin/badges/${id}`, data)
  return response.data
}

export const deleteBadge = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/admin/badges/${id}`)
  return response.data
}
