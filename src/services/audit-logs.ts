import { type PaginationMeta } from '@/types/api'
import { apiClient } from '@/lib/api-client'
import { type AuditLog } from '@/features/settings/data/audit-log-schema'

export const getAuditLogs = async (
  params?: Record<string, unknown>
): Promise<{ data: AuditLog[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/audit-logs', { params })
  return {
    data: response.data?.items ?? [],
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
    },
  }
}
