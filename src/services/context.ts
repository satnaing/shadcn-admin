import type { Shop, Staff } from '@/types/api'
import { apiClient } from '@/lib/api-client'

export const getProfile = async (): Promise<Staff> => {
  const { data } = await apiClient.get<Staff>('/admin/auth/me')
  return data
}

export const getMyShops = async (): Promise<Shop[]> => {
  // Use /admin/staff/my-shops or fallback to /admin/shops
  // Assuming /admin/shops returns all shops available to the user for now
  const response = await apiClient.get('/admin/shops')
  return response.data?.items ?? response.data?.data ?? []
}
