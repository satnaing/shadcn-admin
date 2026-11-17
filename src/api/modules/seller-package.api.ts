import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiResponse } from '@/api/types'
import type { SellerPackage } from '@/features/seller-package/data/seller-package.type'

const E = ENDPOINTS.SELLER_PACKAGE

export const sellerPackageApi = {
  /** Cards, not a table: AEC loads every package at once. */
  list: () => api.get<ApiResponse<SellerPackage[]>>(E.LIST),
  create: (payload: unknown) => api.post<ApiMessageResponse>(E.LIST, payload),
  update: (id: number | string, payload: unknown) =>
    api.put<ApiMessageResponse>(E.ITEM(id), payload),
  remove: (id: number | string) => api.delete<ApiMessageResponse>(E.ITEM(id)),
}
