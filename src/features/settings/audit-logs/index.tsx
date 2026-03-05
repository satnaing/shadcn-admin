import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/settings/audit-logs'
import { useAuditLogs } from '@/hooks/queries/use-audit-logs'
import { BrandLoader } from '@/components/ui/brand-loader'
import { PageTitle } from '@/components/page-title'
import { type AuditLog } from '../data/audit-log-schema'
import { AuditLogsTable } from './audit-logs-table'
import { LogDetailsSheet } from './log-details-sheet'

export function AuditLogsPage() {
  const { page, limit, search } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { data: logs, isLoading } = useAuditLogs({ page, limit, search })

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setIsSheetOpen(true)
  }

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center p-8'>
        <BrandLoader />
      </div>
    )
  }

  const onPaginationChange = (pagination: {
    pageIndex: number
    pageSize: number
  }) => {
    navigate({
      search: (old: Record<string, unknown>) => ({
        ...old,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    })
  }

  return (
    <div className='flex h-full flex-col space-y-6 p-8'>
      <PageTitle
        title='Audit Logs'
        subtitle='Searchable history of sensitive actions taken by staff.'
      />

      <AuditLogsTable
        data={(logs?.data as AuditLog[]) || []}
        pageCount={logs?.meta?.totalPages}
        pagination={{
          pageIndex: page - 1,
          pageSize: limit,
        }}
        onPaginationChange={onPaginationChange}
        onViewDetails={handleViewDetails}
      />

      <LogDetailsSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        log={selectedLog}
      />
    </div>
  )
}
