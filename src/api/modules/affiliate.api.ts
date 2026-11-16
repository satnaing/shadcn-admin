import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ApiMessageResponse,
  ApiPaginatedResponse,
  ApiResponse,
} from '@/api/types'
import type {
  AffiliateListKind,
  AffiliateListParams,
  AffiliateLogItem,
  AffiliateOptions,
  AffiliatePayment,
  AffiliateSettings,
  AffiliateUserDetail,
  AffiliateUserItem,
  FormElement,
  PayMethod,
  ReferralItem,
  WithdrawItem,
} from '@/features/affiliate/data/affiliate.type'

const E = ENDPOINTS.AFFILIATE
const list = <T>(url: string, params: AffiliateListParams = {}) =>
  api.get<ApiPaginatedResponse<T[]>>(
    `${url}?${buildListQueryString({ ...params })}`
  )

export interface ListItemMap {
  users: AffiliateUserItem
  referrals: ReferralItem
  withdraws: WithdrawItem
  logs: AffiliateLogItem
}

const LIST_URLS: Record<AffiliateListKind, string> = {
  users: E.USERS,
  referrals: E.REFERRALS,
  withdraws: E.WITHDRAWS,
  logs: E.LOGS,
}

export interface PayoutPayload {
  amount: number
  payment_method: PayMethod
}

export const affiliateApi = {
  list: <K extends AffiliateListKind>(kind: K, params?: AffiliateListParams) =>
    list<ListItemMap[K]>(LIST_URLS[kind], params),

  settings: () => api.get<ApiResponse<AffiliateSettings>>(E.SETTINGS),
  updateSettings: (payload: AffiliateSettings) =>
    api.put<ApiMessageResponse>(E.SETTINGS, payload),
  options: () => api.get<ApiResponse<AffiliateOptions>>(E.OPTIONS),
  updateOption: (type: string, payload: unknown) =>
    api.put<ApiMessageResponse>(E.OPTION(type), payload),

  registrationForm: () => api.get<ApiResponse<FormElement[]>>(E.FORM),
  updateRegistrationForm: (elements: FormElement[]) =>
    api.put<ApiMessageResponse>(E.FORM, { elements }),

  user: (id: number | string) =>
    api.get<ApiResponse<AffiliateUserDetail>>(E.USER(id)),
  setUserApproved: (id: number | string, is_approved: boolean) =>
    api.patch<ApiMessageResponse>(E.USER_STATUS(id), { is_approved }),
  rejectUser: (id: number | string) =>
    api.post<ApiMessageResponse>(E.USER_REJECT(id)),
  payUser: (id: number | string, payload: PayoutPayload) =>
    api.post<ApiMessageResponse>(E.USER_PAY(id), payload),
  userPayments: (id: number | string) =>
    api.get<ApiPaginatedResponse<AffiliatePayment[]>>(
      `${E.USER_PAYMENTS(id)}?per_page=100`
    ),

  payWithdraw: (id: number | string, payment_method: PayMethod) =>
    api.post<ApiMessageResponse>(E.WITHDRAW_PAY(id), { payment_method }),
  rejectWithdraw: (id: number | string) =>
    api.post<ApiMessageResponse>(E.WITHDRAW_REJECT(id)),
}
