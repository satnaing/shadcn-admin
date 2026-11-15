import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiPaginatedResponse, ApiResponse } from '@/api/types'
import type {
  BatchItem,
  CampaignDetail,
  CampaignListItem,
  CampaignStatus,
  CheckItem,
  CodeDetail,
  CodeListItem,
  DownloadLink,
  PrizeItem,
  ProductOption,
  QrListParams,
  QrSettings,
  StatsResponse,
} from '@/features/qrcode-event/data/qrcode-event.type'
import { buildListQueryString } from '@/shared/utils/list-query-string'

const E = ENDPOINTS.QRCODE_EVENT
const qs = (params: QrListParams = {}) => buildListQueryString({ ...params })
const list = <T>(url: string, params?: QrListParams) => api.get<ApiPaginatedResponse<T[]>>(`${url}?${qs(params)}`)

export const qrcodeEventApi = {
  stats: (campaignId?: string) => api.get<ApiResponse<StatsResponse>>(`${E.STATS}?${qs({ campaign_id: campaignId })}`),
  products: () => api.get<ApiResponse<ProductOption[]>>(E.PRODUCTS),

  campaigns: (params?: QrListParams) => list<CampaignListItem>(E.CAMPAIGNS, params),
  campaign: (id: number | string) => api.get<ApiResponse<CampaignDetail>>(E.CAMPAIGN(id)),
  createCampaign: (payload: unknown) => api.post<ApiMessageResponse>(E.CAMPAIGNS, payload),
  updateCampaign: (id: number | string, payload: unknown) => api.put<ApiMessageResponse>(E.CAMPAIGN(id), payload),
  setCampaignStatus: (id: number | string, status: CampaignStatus) =>
    api.patch<ApiMessageResponse>(E.CAMPAIGN_STATUS(id), { status }),
  removeCampaign: (id: number | string) => api.delete<ApiMessageResponse>(E.CAMPAIGN(id)),

  prizes: (campaignId: number | string) => api.get<ApiResponse<PrizeItem[]>>(E.PRIZES(campaignId)),
  createPrize: (campaignId: number | string, payload: unknown) => api.post<ApiMessageResponse>(E.PRIZES(campaignId), payload),
  updatePrize: (id: number | string, payload: unknown) => api.put<ApiMessageResponse>(E.PRIZE(id), payload),
  removePrize: (id: number | string) => api.delete<ApiMessageResponse>(E.PRIZE(id)),

  batches: (params?: QrListParams) => list<BatchItem>(E.BATCHES, params),
  createBatch: (payload: unknown) => api.post<ApiMessageResponse>(E.BATCHES, payload),
  exportBatch: (id: number | string, format: 'xlsx' | 'csv') =>
    api.get<ApiResponse<DownloadLink>>(`${E.BATCH_EXPORT(id)}?format=${format}`),
  batchQrZip: (id: number | string) => api.get<ApiResponse<DownloadLink>>(E.BATCH_QR_ZIP(id)),

  codes: (params?: QrListParams) => list<CodeListItem>(E.CODES, params),
  code: (id: number | string) => api.get<ApiResponse<CodeDetail>>(E.CODE(id)),
  exportCodes: (params?: QrListParams) => api.get<ApiResponse<DownloadLink>>(`${E.CODES_EXPORT}?${qs(params)}`),
  toggleCode: (id: number | string) => api.patch<ApiMessageResponse>(E.CODE_TOGGLE(id)),
  claimCode: (id: number | string, claim_note: string) => api.post<ApiMessageResponse>(E.CODE_CLAIM(id), { claim_note }),

  logs: (params?: QrListParams) => list<CheckItem>(E.LOGS, params),
  exportLogs: (params?: QrListParams) => api.get<ApiResponse<DownloadLink>>(`${E.LOGS_EXPORT}?${qs(params)}`),

  settings: () => api.get<ApiResponse<QrSettings>>(E.SETTINGS),
  updateSettings: (payload: QrSettings) => api.put<ApiMessageResponse>(E.SETTINGS, payload),
}
