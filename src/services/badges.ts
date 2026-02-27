import { apiClient } from '@/lib/api-client'
import { type Badge } from '@/features/menu/data/badge-schema'

export const getBadges = async (): Promise<Badge[]> => {
  const response = await apiClient.get('/admin/badges')
  return response.data
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
