import { useQuery } from '@tanstack/react-query'
import { courierApi } from '@/api/modules/courier.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { CourierListKind, CourierListParams } from '../data/courier.type'

export const courierKeys = {
  all: ['COURIER'] as const,
  list: (kind: CourierListKind, p?: CourierListParams) =>
    [...courierKeys.all, 'list', kind, p] as const,
  detail: (id: number | string) => [...courierKeys.all, 'detail', id] as const,
  settings: () => [...courierKeys.all, 'settings'] as const,
  lookups: () => [...courierKeys.all, 'lookups'] as const,
}

/** One kind-aware list hook (couriers / payments / deliveries …): the server filters, sorts and pages. */
export const useCourierList = <K extends CourierListKind>(
  kind: K,
  params?: CourierListParams
) =>
  usePaginatedQuery({
    queryKey: courierKeys.list(kind, params),
    queryFn: () => courierApi.list(kind, params),
  })

export const useCourier = (id?: number | string) =>
  useQuery({
    queryKey: courierKeys.detail(id ?? ''),
    queryFn: () => courierApi.courier(id ?? ''),
    enabled: !!id,
  })

export const useCourierSettings = () =>
  useQuery({ queryKey: courierKeys.settings(), queryFn: courierApi.settings })

export const useCourierLookups = () =>
  useQuery({ queryKey: courierKeys.lookups(), queryFn: courierApi.lookups })
