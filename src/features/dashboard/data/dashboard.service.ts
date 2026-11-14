import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/api/types'
import type { DashboardData } from './dashboard.type'

export const dashboardKeys = { all: ['DASHBOARD'] as const }

export const dashboardService = {
  get: () => api.get<ApiResponse<DashboardData>>(ENDPOINTS.DASHBOARD),
}
