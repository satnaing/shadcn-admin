import { useQuery } from '@tanstack/react-query'
import { dashboardKeys, dashboardService } from '../data/dashboard.service'

export function useDashboardStats() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.getStats,
    staleTime: 60 * 1000,
  })

  return {
    stats: data?.data,
    isLoading,
    isError,
    error,
    refetch,
  }
}
