import type { Shop, FulfillmentMethod } from '@/types/api'
import { apiClient } from '@/lib/api-client'

export const getShops = async (): Promise<Shop[]> => {
  const response = await apiClient.get('/admin/shops')
  return response.data
}

export const getShop = async (id: string): Promise<Shop> => {
  const response = await apiClient.get(`/admin/shops/${id}`)
  return response.data
}

export const updateShop = async (
  id: string,
  data: Partial<Shop> | Record<string, unknown>
): Promise<Shop> => {
  const response = await apiClient.patch(`/admin/shops/${id}`, data)
  return response.data
}

export const getShopFulfillmentMethods = async (
  id: string
): Promise<FulfillmentMethod[]> => {
  const response = await apiClient.get(
    `/admin/shops/${id}/config/fulfillment-methods`
  )
  return response.data
}
