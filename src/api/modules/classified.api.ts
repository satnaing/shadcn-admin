import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ApiMessageResponse,
  ApiPaginatedResponse,
  ApiResponse,
} from '@/api/types'
import type {
  ClassifiedListParams,
  ClassifiedPackage,
  ClassifiedProduct,
} from '@/features/classified/data/classified.type'

const E = ENDPOINTS.CLASSIFIED

export const classifiedApi = {
  products: (params: ClassifiedListParams = {}) =>
    api.get<ApiPaginatedResponse<ClassifiedProduct[]>>(
      `${E.PRODUCTS}?${buildListQueryString({ ...params })}`
    ),
  setPublished: (id: number | string, is_published: boolean) =>
    api.patch<ApiMessageResponse>(E.PRODUCT(id), { is_published }),
  removeProduct: (id: number | string) =>
    api.delete<ApiMessageResponse>(E.PRODUCT(id)),
  removeProducts: (ids: number[]) =>
    api.post<ApiMessageResponse>(E.PRODUCTS_DELETE, { ids }),

  /** Cards, not a table: AEC loads every package at once. */
  packages: () => api.get<ApiResponse<ClassifiedPackage[]>>(E.PACKAGES),
  createPackage: (payload: unknown) =>
    api.post<ApiMessageResponse>(E.PACKAGES, payload),
  updatePackage: (id: number | string, payload: unknown) =>
    api.put<ApiMessageResponse>(E.PACKAGE(id), payload),
  removePackage: (id: number | string) =>
    api.delete<ApiMessageResponse>(E.PACKAGE(id)),
}
