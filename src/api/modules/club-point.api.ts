import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ApiMessageResponse,
  ApiPaginatedResponse,
  ApiResponse,
} from '@/api/types'
import type {
  ClubPointListParams,
  ClubPointSettings,
  EarningDetail,
  EarningItem,
  ProductPointItem,
  RangePayload,
} from '@/features/club-point/data/club-point.type'

const E = ENDPOINTS.CLUB_POINT
const list = <T>(url: string, params: ClubPointListParams = {}) =>
  api.get<ApiPaginatedResponse<T[]>>(
    `${url}?${buildListQueryString({ ...params })}`
  )

/** Bulk writes answer with how many products changed. */
export interface BulkResult extends ApiMessageResponse {
  data: { updated: number }
}

export const clubPointApi = {
  earnings: (params?: ClubPointListParams) =>
    list<EarningItem>(E.EARNINGS, params),
  earning: (id: number | string) =>
    api.get<ApiResponse<EarningDetail>>(E.EARNING(id)),

  products: (params?: ClubPointListParams) =>
    list<ProductPointItem>(E.PRODUCTS, params),
  setProductPoint: (id: number | string, point: number) =>
    api.put<ApiMessageResponse>(E.PRODUCT(id), { point }),
  setRangePoint: (payload: RangePayload) =>
    api.post<BulkResult>(E.PRODUCTS_RANGE, payload),
  setAllPoint: (point: number) =>
    api.post<BulkResult>(E.PRODUCTS_ALL, { point }),

  settings: () => api.get<ApiResponse<ClubPointSettings>>(E.SETTINGS),
  updateSettings: (payload: ClubPointSettings) =>
    api.put<ApiMessageResponse>(E.SETTINGS, payload),
}
