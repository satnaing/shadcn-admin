import { useQuery } from '@tanstack/react-query'
import { dashboardKeys, dashboardService } from '../data/dashboard.service'

export const useDashboard = () =>
  useQuery({
    queryKey: dashboardKeys.all,
    queryFn: dashboardService.get,
    staleTime: 60_000,
  })
