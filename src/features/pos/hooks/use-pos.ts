import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { posApi } from '@/api/modules/pos.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PosListParams } from '../data/pos.type'

export const posKeys = {
  all: ['POS'] as const,
  stock: (p?: PosListParams) => [...posKeys.all, 'stock', p] as const,
  products: (p?: PosListParams) => [...posKeys.all, 'products', p] as const,
  available: (p?: PosListParams) => [...posKeys.all, 'available', p] as const,
  orders: (p?: PosListParams) => [...posKeys.all, 'orders', p] as const,
  customers: (field: string, q: string) => [...posKeys.all, 'customers', field, q] as const,
  addresses: (id: number | null) => [...posKeys.all, 'addresses', id] as const,
  settings: () => [...posKeys.all, 'settings'] as const,
  lookups: () => [...posKeys.all, 'lookups'] as const,
}

const PAGE = 16

/** Terminal grid: AEC loads 16 cards per request and appends on "Load more". */
export const usePosStock = (params: PosListParams) =>
  useInfiniteQuery({
    queryKey: posKeys.stock(params),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => posApi.stock({ ...params, page: pageParam, per_page: PAGE }),
    getNextPageParam: (last) =>
      last.meta.current_page < last.meta.last_page ? last.meta.current_page + 1 : undefined,
  })

export const usePosProducts = (params: PosListParams) =>
  usePaginatedQuery({ queryKey: posKeys.products(params), queryFn: () => posApi.products(params) })

export const usePosAvailable = (params: PosListParams, enabled: boolean) =>
  useQuery({
    queryKey: posKeys.available(params),
    queryFn: () => posApi.available(params),
    enabled,
    placeholderData: keepPreviousData,
  })

export const usePosOrders = (params: PosListParams) =>
  usePaginatedQuery({ queryKey: posKeys.orders(params), queryFn: () => posApi.orders(params) })

/** AEC only searched from 3 characters on. */
export const usePosCustomerSearch = (field: 'phone' | 'email', q: string) =>
  useQuery({
    queryKey: posKeys.customers(field, q),
    queryFn: () => posApi.customers(field, q),
    enabled: q.trim().length >= 3,
  })

export const usePosAddresses = (customerId: number | null) =>
  useQuery({
    queryKey: posKeys.addresses(customerId),
    queryFn: () => posApi.addresses(customerId ?? 0),
    enabled: customerId !== null,
  })

export const usePosSettings = () =>
  useQuery({ queryKey: posKeys.settings(), queryFn: posApi.settings })

export const usePosLookups = () =>
  useQuery({ queryKey: posKeys.lookups(), queryFn: posApi.lookups, staleTime: 5 * 60_000 })
