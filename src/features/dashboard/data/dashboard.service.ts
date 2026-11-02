import { requestInstanceClient } from '@/config/api'
import type { WithData } from '@/shared/types'
import type { DashboardStatsResponse } from './dashboard.type'

export const dashboardService = {
  getStats: () =>
    requestInstanceClient.get<WithData<DashboardStatsResponse>>(
      '/admin/dashboard/stats'
    ),
}

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
}
