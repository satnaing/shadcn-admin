import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiPaginatedResponse, ApiResponse } from '@/api/types'
import type { AddressFormValues } from '@/features/pos/data/pos.schema'
import type {
  PosAddress,
  PosCustomer,
  PosListParams,
  PosLookups,
  PosOrderItem,
  PosOrderPayload,
  PosOrderResult,
  PosProductItem,
  PosSettings,
  PosStockItem,
  ReceiptLink,
} from '@/features/pos/data/pos.type'

const E = ENDPOINTS.POS
const list = <T>(url: string, params: PosListParams = {}) =>
  api.get<ApiPaginatedResponse<T[]>>(`${url}?${buildListQueryString({ ...params })}`)

export const posApi = {
  stock: (params?: PosListParams) => list<PosStockItem>(E.STOCK, params),
  products: (params?: PosListParams) => list<PosProductItem>(E.PRODUCTS, params),
  available: (params?: PosListParams) => list<PosProductItem>(E.PRODUCTS_AVAILABLE, params),
  setInPos: (ids: number[], pos: boolean) => api.put<ApiMessageResponse>(E.PRODUCTS, { ids, pos }),

  customers: (field: 'phone' | 'email', q: string) =>
    api.get<ApiResponse<PosCustomer[]>>(`${E.CUSTOMERS}?${buildListQueryString({ field, q })}`),
  addresses: (customerId: number | string) =>
    api.get<ApiResponse<PosAddress[]>>(E.ADDRESSES(customerId)),
  createAddress: (customerId: number | string, values: AddressFormValues) =>
    api.post<ApiResponse<PosAddress>>(E.ADDRESSES(customerId), values),

  orders: (params?: PosListParams) => list<PosOrderItem>(E.ORDERS, params),
  placeOrder: (payload: PosOrderPayload) => api.post<ApiResponse<PosOrderResult>>(E.ORDERS, payload),
  receipt: (id: number | string) => api.get<ApiResponse<ReceiptLink>>(E.RECEIPT(id)),

  settings: () => api.get<ApiResponse<PosSettings>>(E.SETTINGS),
  updateSettings: (values: Partial<PosSettings>) => api.put<ApiMessageResponse>(E.SETTINGS, values),
  lookups: () => api.get<ApiResponse<PosLookups>>(E.LOOKUPS),
}
