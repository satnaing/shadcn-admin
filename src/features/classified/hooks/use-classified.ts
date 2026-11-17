import { useQuery } from '@tanstack/react-query'
import { classifiedApi } from '@/api/modules/classified.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { ClassifiedListParams } from '../data/classified.type'

export const classifiedKeys = {
  all: ['CLASSIFIED'] as const,
  products: (p?: ClassifiedListParams) =>
    [...classifiedKeys.all, 'products', p] as const,
  packages: () => [...classifiedKeys.all, 'packages'] as const,
}

export const useClassifiedProducts = (params?: ClassifiedListParams) =>
  usePaginatedQuery({
    queryKey: classifiedKeys.products(params),
    queryFn: () => classifiedApi.products(params),
  })

export const useClassifiedPackages = () =>
  useQuery({
    queryKey: classifiedKeys.packages(),
    queryFn: classifiedApi.packages,
  })
