import { useQuery } from '@tanstack/react-query'
import * as auditLogsService from '@/services/audit-logs'

export const AUDIT_LOGS_QUERY_KEY = ['audit-logs']

export function useAuditLogs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_QUERY_KEY, params],
    queryFn: () => auditLogsService.getAuditLogs(params),
  })
}
