import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiPaginatedResponse, ApiResponse } from '@/api/types'
import type {
  BulkSmsPayload,
  GatewayItem,
  OtpListParams,
  OtpSettings,
  Recipient,
  TemplateItem,
} from '@/features/otp/data/otp.type'

const E = ENDPOINTS.OTP

export const otpApi = {
  settings: () => api.get<ApiResponse<OtpSettings>>(E.SETTINGS),
  updateSettings: (values: Partial<OtpSettings>) => api.put<ApiMessageResponse>(E.SETTINGS, values),

  gateways: () => api.get<ApiResponse<GatewayItem[]>>(E.GATEWAYS),
  updateGateway: (key: string, credentials: Record<string, string>) =>
    api.put<ApiMessageResponse>(E.GATEWAY(key), { credentials }),
  setGatewayActive: (key: string, active: boolean) =>
    api.put<ApiMessageResponse>(E.GATEWAY_ACTIVATION(key), { active }),

  templates: (params: OtpListParams = {}) =>
    api.get<ApiPaginatedResponse<TemplateItem[]>>(`${E.TEMPLATES}?${buildListQueryString({ ...params })}`),
  updateTemplate: (id: number, values: Partial<Pick<TemplateItem, 'body' | 'template_id' | 'active'>>) =>
    api.put<ApiMessageResponse>(E.TEMPLATE(id), values),

  recipients: (q: string) => api.get<ApiResponse<Recipient[]>>(`${E.RECIPIENTS}?${buildListQueryString({ q })}`),
  sendSms: (payload: BulkSmsPayload) => api.post<ApiResponse<{ sent: number }> & { message: string }>(E.SMS, payload),
}
