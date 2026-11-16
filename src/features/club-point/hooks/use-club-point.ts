import { useQuery } from '@tanstack/react-query'
import { clubPointApi } from '@/api/modules/club-point.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { ClubPointListParams } from '../data/club-point.type'

export const clubPointKeys = {
  all: ['CLUB_POINT'] as const,
  earnings: (p?: ClubPointListParams) =>
    [...clubPointKeys.all, 'earnings', p] as const,
  earning: (id: number | string) =>
    [...clubPointKeys.all, 'earning', id] as const,
  products: (p?: ClubPointListParams) =>
    [...clubPointKeys.all, 'products', p] as const,
  settings: () => [...clubPointKeys.all, 'settings'] as const,
}

export const useEarnings = (params?: ClubPointListParams) =>
  usePaginatedQuery({
    queryKey: clubPointKeys.earnings(params),
    queryFn: () => clubPointApi.earnings(params),
  })

export const useEarning = (id?: number | string) =>
  useQuery({
    queryKey: clubPointKeys.earning(id ?? ''),
    queryFn: () => clubPointApi.earning(id ?? ''),
    enabled: !!id,
  })

export const useProductPoints = (params?: ClubPointListParams) =>
  usePaginatedQuery({
    queryKey: clubPointKeys.products(params),
    queryFn: () => clubPointApi.products(params),
  })

export const useClubPointSettings = () =>
  useQuery({
    queryKey: clubPointKeys.settings(),
    queryFn: clubPointApi.settings,
  })
