import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ApiMessageResponse,
  ApiPaginatedResponse,
  ApiResponse,
} from '@/api/types'
import type { CourierFormValues } from '@/features/courier/data/courier.schema'
import type {
  CourierDetail,
  CourierListKind,
  CourierListParams,
  CourierLookups,
  CourierSettings,
  ListItemMap,
} from '@/features/courier/data/courier.type'

const E = ENDPOINTS.COURIER
const LIST_URLS: Record<CourierListKind, string> = {
  couriers: E.COURIERS,
  payments: E.PAYMENTS,
  collections: E.COLLECTIONS,
  cancelRequests: E.CANCEL_REQUESTS,
  deliveries: E.DELIVERIES,
  cash: E.CASH,
  earnings: E.EARNINGS,
}
const list = <T>(url: string, params: CourierListParams = {}) =>
  api.get<ApiPaginatedResponse<T[]>>(
    `${url}?${buildListQueryString({ ...params })}`
  )

export const courierApi = {
  list: <K extends CourierListKind>(kind: K, params?: CourierListParams) =>
    list<ListItemMap[K]>(LIST_URLS[kind], params),
  courier: (id: number | string) =>
    api.get<ApiResponse<CourierDetail>>(E.COURIER(id)),
  create: (values: CourierFormValues) =>
    api.post<ApiMessageResponse>(E.COURIERS, values),
  update: (id: number | string, values: CourierFormValues) =>
    api.put<ApiMessageResponse>(E.COURIER(id), values),
  setBanned: (id: number | string, banned: boolean) =>
    api.put<ApiMessageResponse>(E.BAN(id), { banned }),
  collect: (id: number | string, amount: number) =>
    api.post<ApiMessageResponse>(E.COLLECT(id), { amount }),
  pay: (id: number | string, amount: number) =>
    api.post<ApiMessageResponse>(E.PAY(id), { amount }),
  lookups: () => api.get<ApiResponse<CourierLookups>>(E.LOOKUPS),

  settings: () => api.get<ApiResponse<CourierSettings>>(E.SETTINGS),
  updateSettings: (values: Partial<CourierSettings>) =>
    api.put<ApiMessageResponse>(E.SETTINGS, values),

  requestCancel: (id: number | string) =>
    api.post<ApiMessageResponse>(E.DELIVERY_CANCEL(id)),
}
