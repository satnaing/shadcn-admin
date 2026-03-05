import type { Shop, FulfillmentMethod, PaginationMeta } from '@/types/api'
import { apiClient } from '@/lib/api-client'

export const getShops = async (
  params?: Record<string, unknown>
): Promise<{ data: Shop[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/shops', { params })
  return {
    data: response.data?.items ?? response.data?.data ?? [],
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
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
