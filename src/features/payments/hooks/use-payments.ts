import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { paymentsApi } from '@/api/modules/payments.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PackageKind, PaymentsListParams } from '../data/payments.type'

export const paymentsKeys = {
  all: ['Payments'] as const,
  manual: (p?: PaymentsListParams) => [...paymentsKeys.all, 'manual', p] as const,
  orders: (p?: PaymentsListParams) => [...paymentsKeys.all, 'orders', p] as const,
  wallet: (p?: PaymentsListParams) => [...paymentsKeys.all, 'wallet', p] as const,
  packages: (kind: PackageKind, p?: PaymentsListParams) => [...paymentsKeys.all, 'packages', kind, p] as const,
  payouts: (p?: PaymentsListParams) => [...paymentsKeys.all, 'payouts', p] as const,
  payriff: () => [...paymentsKeys.all, 'payriff'] as const,
  customers: (q: string) => [...paymentsKeys.all, 'customers', q] as const,
}

export const usePaymentsManual = (p: PaymentsListParams) =>
  usePaginatedQuery({ queryKey: paymentsKeys.manual(p), queryFn: () => paymentsApi.manualMethods(p) })

export const usePaymentsOrders = (p: PaymentsListParams) =>
  usePaginatedQuery({ queryKey: paymentsKeys.orders(p), queryFn: () => paymentsApi.offlineOrders(p) })

export const usePaymentsWallet = (p: PaymentsListParams) =>
  usePaginatedQuery({ queryKey: paymentsKeys.wallet(p), queryFn: () => paymentsApi.walletRequests(p) })

/** One kind-aware hook for seller and customer package requests (same shape, two endpoints). */
export const usePaymentsPackages = (kind: PackageKind, p: PaymentsListParams) =>
  usePaginatedQuery({ queryKey: paymentsKeys.packages(kind, p), queryFn: () => paymentsApi.packageRequests(kind, p) })

export const usePaymentsPayouts = (p: PaymentsListParams) =>
  usePaginatedQuery({ queryKey: paymentsKeys.payouts(p), queryFn: () => paymentsApi.payoutMethods(p) })

export const usePayriff = () => useQuery({ queryKey: paymentsKeys.payriff(), queryFn: paymentsApi.payriff })

/** Customers are searched on the server (2 characters minimum), never loaded as one list. */
export const usePaymentsCustomers = (q: string) =>
  useQuery({
    queryKey: paymentsKeys.customers(q),
    queryFn: () => paymentsApi.customers(q),
    enabled: q.trim().length >= 2,
    placeholderData: keepPreviousData,
  })
