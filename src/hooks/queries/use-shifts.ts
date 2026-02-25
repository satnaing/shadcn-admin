import { useQuery } from '@tanstack/react-query'
import { getShifts } from '@/services/ops'
import { type GetShiftsFilters } from '@/types/ops'

export const SHIFTS_QUERY_KEY = ['shifts']

export function useShifts(filters: GetShiftsFilters) {
  return useQuery({
    queryKey: [...SHIFTS_QUERY_KEY, filters],
    queryFn: () => getShifts(filters),
    enabled: !!filters.shopId,
  })
}
