import { useQuery } from '@tanstack/react-query'
import { wholesaleApi } from '@/api/modules/wholesale.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { WholesaleListParams } from '../data/wholesale.type'

export const wholesaleKeys = {
  all: ['WHOLESALE'] as const,
  products: (p?: WholesaleListParams) =>
    [...wholesaleKeys.all, 'products', p] as const,
  product: (id: number | string) =>
    [...wholesaleKeys.all, 'product', id] as const,
  lookups: () => [...wholesaleKeys.all, 'lookups'] as const,
}

export const useWholesaleProducts = (params?: WholesaleListParams) =>
  usePaginatedQuery({
    queryKey: wholesaleKeys.products(params),
    queryFn: () => wholesaleApi.products(params),
  })

export const useWholesaleProduct = (id?: number | string) =>
  useQuery({
    queryKey: wholesaleKeys.product(id ?? ''),
    queryFn: () => wholesaleApi.product(id ?? ''),
    enabled: !!id,
  })

export const useWholesaleLookups = () =>
  useQuery({
    queryKey: wholesaleKeys.lookups(),
    queryFn: wholesaleApi.lookups,
    staleTime: 60_000,
  })
