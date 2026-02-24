import { apiClient } from '@/lib/api-client'
import { type AuditLog } from '@/features/settings/data/audit-log-schema'

export interface PaginatedResponse<T> {
  items: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const getAuditLogs = async (
  params?: Record<string, unknown>
): Promise<PaginatedResponse<AuditLog>> => {
  const response = await apiClient.get('/admin/audit-logs', { params })
  return response.data
}
