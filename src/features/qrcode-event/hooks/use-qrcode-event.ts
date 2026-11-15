import { useQuery } from '@tanstack/react-query'
import { qrcodeEventApi } from '@/api/modules/qrcode-event.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { QrListParams } from '../data/qrcode-event.type'

export const qrKeys = {
  all: ['QRCODE_EVENT'] as const,
  stats: (campaignId?: string) => [...qrKeys.all, 'stats', campaignId] as const,
  products: () => [...qrKeys.all, 'products'] as const,
  campaigns: (p?: QrListParams) => [...qrKeys.all, 'campaigns', p] as const,
  campaign: (id: number | string) => [...qrKeys.all, 'campaign', id] as const,
  prizes: (campaignId: number | string) => [...qrKeys.all, 'prizes', campaignId] as const,
  batches: (p?: QrListParams) => [...qrKeys.all, 'batches', p] as const,
  codes: (p?: QrListParams) => [...qrKeys.all, 'codes', p] as const,
  code: (id: number | string) => [...qrKeys.all, 'code', id] as const,
  logs: (p?: QrListParams) => [...qrKeys.all, 'logs', p] as const,
  settings: () => [...qrKeys.all, 'settings'] as const,
}

export const useQrStats = (campaignId?: string) =>
  useQuery({ queryKey: qrKeys.stats(campaignId), queryFn: () => qrcodeEventApi.stats(campaignId) })

export const useQrProducts = () =>
  useQuery({ queryKey: qrKeys.products(), queryFn: qrcodeEventApi.products, staleTime: 5 * 60_000 })

export const useQrCampaigns = (params?: QrListParams) =>
  usePaginatedQuery({ queryKey: qrKeys.campaigns(params), queryFn: () => qrcodeEventApi.campaigns(params) })

export const useQrCampaign = (id?: string | number) =>
  useQuery({
    queryKey: qrKeys.campaign(id ?? ''),
    queryFn: () => qrcodeEventApi.campaign(id ?? ''),
    enabled: !!id,
  })

export const useQrPrizes = (campaignId?: string | number) =>
  useQuery({
    queryKey: qrKeys.prizes(campaignId ?? ''),
    queryFn: () => qrcodeEventApi.prizes(campaignId ?? ''),
    enabled: !!campaignId,
  })

export const useQrBatches = (params?: QrListParams) =>
  usePaginatedQuery({ queryKey: qrKeys.batches(params), queryFn: () => qrcodeEventApi.batches(params) })

export const useQrCodes = (params?: QrListParams) =>
  usePaginatedQuery({ queryKey: qrKeys.codes(params), queryFn: () => qrcodeEventApi.codes(params) })

export const useQrCode = (id?: string | number) =>
  useQuery({ queryKey: qrKeys.code(id ?? ''), queryFn: () => qrcodeEventApi.code(id ?? ''), enabled: !!id })

export const useQrLogs = (params?: QrListParams) =>
  usePaginatedQuery({ queryKey: qrKeys.logs(params), queryFn: () => qrcodeEventApi.logs(params) })

export const useQrSettings = () =>
  useQuery({ queryKey: qrKeys.settings(), queryFn: qrcodeEventApi.settings })
