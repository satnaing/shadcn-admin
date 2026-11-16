import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiPaginatedResponse, ApiResponse } from '@/api/types'
import type {
  CustomerLookup,
  ManualMethod,
  OfflineOrder,
  PackageKind,
  PackageRequest,
  PaymentsListParams,
  PayoutMethod,
  PayriffSettings,
  RechargePayload,
  WalletRequest,
} from '@/features/payments/data/payments.type'

const E = ENDPOINTS.PAYMENTS
const list = (url: string, params: PaymentsListParams) => `${url}?${buildListQueryString({ ...params })}`
const packagesUrl = (kind: PackageKind) => (kind === 'seller' ? E.SELLER_PACKAGES : E.CUSTOMER_PACKAGES)

export type ManualPayload = Omit<ManualMethod, 'id'>
export type PayoutPayload = Pick<PayoutMethod, 'type' | 'name' | 'logo'>

export const paymentsApi = {
  manualMethods: (p: PaymentsListParams = {}) =>
    api.get<ApiPaginatedResponse<ManualMethod[]>>(list(E.MANUAL_METHODS, p)),
  createManualMethod: (v: ManualPayload) => api.post<ApiMessageResponse>(E.MANUAL_METHODS, v),
  updateManualMethod: (id: number, v: ManualPayload) => api.put<ApiMessageResponse>(E.MANUAL_METHOD(id), v),
  deleteManualMethod: (id: number) => api.delete<ApiMessageResponse>(E.MANUAL_METHOD(id)),

  offlineOrders: (p: PaymentsListParams = {}) =>
    api.get<ApiPaginatedResponse<OfflineOrder[]>>(list(E.OFFLINE_ORDERS, p)),

  walletRequests: (p: PaymentsListParams = {}) =>
    api.get<ApiPaginatedResponse<WalletRequest[]>>(list(E.WALLET_REQUESTS, p)),
  approveWallet: (ids: number[]) => api.post<ApiMessageResponse>(E.WALLET_APPROVE, { ids }),
  recharge: (v: RechargePayload) => api.post<ApiMessageResponse>(E.WALLET_RECHARGE, v),
  customers: (q: string) => api.get<ApiResponse<CustomerLookup[]>>(list(E.CUSTOMERS, { q })),

  packageRequests: (kind: PackageKind, p: PaymentsListParams = {}) =>
    api.get<ApiPaginatedResponse<PackageRequest[]>>(list(packagesUrl(kind), p)),
  approvePackage: (kind: PackageKind, id: number) =>
    api.post<ApiMessageResponse>(`${packagesUrl(kind)}/${id}/approve`),

  payoutMethods: (p: PaymentsListParams = {}) =>
    api.get<ApiPaginatedResponse<PayoutMethod[]>>(list(E.PAYOUT_METHODS, p)),
  createPayoutMethod: (v: PayoutPayload) => api.post<ApiMessageResponse>(E.PAYOUT_METHODS, v),
  updatePayoutMethod: (id: number, v: PayoutPayload) => api.put<ApiMessageResponse>(E.PAYOUT_METHOD(id), v),
  deletePayoutMethods: (ids: number[]) => api.post<ApiMessageResponse>(E.PAYOUT_BULK_DELETE, { ids }),

  payriff: () => api.get<ApiResponse<PayriffSettings>>(E.PAYRIFF),
  updatePayriff: (v: Omit<PayriffSettings, 'active'>) => api.put<ApiMessageResponse>(E.PAYRIFF, v),
  setPayriffActive: (active: boolean) => api.put<ApiMessageResponse>(E.PAYRIFF_ACTIVATION, { active }),
}
