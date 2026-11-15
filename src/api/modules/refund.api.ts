import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiPaginatedResponse, ApiResponse } from '@/api/types'
import type {
  CategoryRefundItem,
  ReasonItem,
  RefundDetail,
  RefundListItem,
  RefundListParams,
  RefundSettings,
} from '@/features/refund/data/refund.type'
import { buildListQueryString } from '@/shared/utils/list-query-string'

const E = ENDPOINTS.REFUND
const qs = (params: RefundListParams = {}) => buildListQueryString({ ...params })
const list = <T>(url: string, params?: RefundListParams) => api.get<ApiPaginatedResponse<T[]>>(`${url}?${qs(params)}`)

export interface PayPayload {
  method: 'wallet' | 'offline'
  transaction_id?: string
  receipt?: string
}

export const refundApi = {
  requests: (params?: RefundListParams) => list<RefundListItem>(E.REQUESTS, params),
  disputes: (params?: RefundListParams) => list<RefundListItem>(E.DISPUTES, params),
  request: (id: number | string) => api.get<ApiResponse<RefundDetail>>(E.REQUEST(id)),
  pay: (id: number | string, payload: PayPayload) => api.post<ApiMessageResponse>(E.PAY(id), payload),
  reject: (id: number | string, reason: string) => api.post<ApiMessageResponse>(E.REJECT(id), { reason }),
  payDispute: (id: number | string, payload: PayPayload) => api.post<ApiMessageResponse>(E.DISPUTE_PAY(id), payload),
  rejectDispute: (id: number | string, reason: string) =>
    api.post<ApiMessageResponse>(E.DISPUTE_REJECT(id), { reason }),

  reasons: (params?: RefundListParams) => list<ReasonItem>(E.REASONS, params),
  /** Rejection presets for the reject dialog (active only, no paging). */
  rejectionReasons: () => api.get<ApiResponse<ReasonItem[]>>(`${E.REASONS}?kind=rejection&active=1&per_page=100`),
  createReason: (payload: unknown) => api.post<ApiMessageResponse>(E.REASONS, payload),
  updateReason: (id: number | string, payload: unknown) => api.put<ApiMessageResponse>(E.REASON(id), payload),
  removeReason: (id: number | string) => api.delete<ApiMessageResponse>(E.REASON(id)),
  setReasonsActive: (ids: number[], is_active: boolean) =>
    api.patch<ApiMessageResponse>(E.REASONS_STATUS, { ids, is_active }),

  categories: (params?: RefundListParams) => list<CategoryRefundItem>(E.CATEGORIES, params),
  setCategoryDays: (id: number | string, refund_days: number) =>
    api.put<ApiMessageResponse>(E.CATEGORY(id), { refund_days }),
  bulkCategoryDays: (ids: number[], refund_days: number) =>
    api.post<ApiMessageResponse>(E.CATEGORIES_BULK, { ids, refund_days }),

  settings: () => api.get<ApiResponse<RefundSettings>>(E.SETTINGS),
  updateSettings: (payload: RefundSettings) => api.put<ApiMessageResponse>(E.SETTINGS, payload),
}
