import type { Shop, FulfillmentMethod, PaginationMeta } from '@/types/api'
import { apiClient } from '@/lib/api-client'

export const getShops = async (
  params?: Record<string, unknown>
): Promise<{ data: Shop[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/shops', { params })
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
