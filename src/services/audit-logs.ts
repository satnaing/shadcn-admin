import { type PaginationMeta } from '@/types/api'
import { apiClient } from '@/lib/api-client'
import { type AuditLog } from '@/features/settings/data/audit-log-schema'

export const getAuditLogs = async (
  params?: Record<string, unknown>
): Promise<{ data: AuditLog[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/audit-logs', { params })
  return {
    data: response.data?.items ?? [],
    meta: response.data?.meta ?? {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  }
}
