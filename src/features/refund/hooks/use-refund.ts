import { useQuery } from '@tanstack/react-query'
import { refundApi } from '@/api/modules/refund.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { RefundListParams } from '../data/refund.type'

export const refundKeys = {
  all: ['REFUND'] as const,
  requests: (p?: RefundListParams) => [...refundKeys.all, 'requests', p] as const,
  disputes: (p?: RefundListParams) => [...refundKeys.all, 'disputes', p] as const,
  request: (id: number | string) => [...refundKeys.all, 'request', id] as const,
  reasons: (p?: RefundListParams) => [...refundKeys.all, 'reasons', p] as const,
  rejectionReasons: () => [...refundKeys.all, 'rejection-reasons'] as const,
  categories: (p?: RefundListParams) => [...refundKeys.all, 'categories', p] as const,
  settings: () => [...refundKeys.all, 'settings'] as const,
}

export const useRefundRequests = (params?: RefundListParams) =>
  usePaginatedQuery({ queryKey: refundKeys.requests(params), queryFn: () => refundApi.requests(params) })

export const useRefundDisputes = (params?: RefundListParams) =>
  usePaginatedQuery({ queryKey: refundKeys.disputes(params), queryFn: () => refundApi.disputes(params) })

export const useRefundDetail = (id?: number | string) =>
  useQuery({ queryKey: refundKeys.request(id ?? ''), queryFn: () => refundApi.request(id ?? ''), enabled: !!id })

export const useRefundReasons = (params?: RefundListParams) =>
  usePaginatedQuery({ queryKey: refundKeys.reasons(params), queryFn: () => refundApi.reasons(params) })

export const useRejectionReasons = () =>
  useQuery({ queryKey: refundKeys.rejectionReasons(), queryFn: refundApi.rejectionReasons, staleTime: 60_000 })

export const useRefundCategories = (params?: RefundListParams) =>
  usePaginatedQuery({ queryKey: refundKeys.categories(params), queryFn: () => refundApi.categories(params) })

export const useRefundSettings = () => useQuery({ queryKey: refundKeys.settings(), queryFn: refundApi.settings })
