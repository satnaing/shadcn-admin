import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { CHECK_RESULTS } from '../data/qrcode-event.type'
import { useQrLogs } from '../hooks/use-qrcode-event'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'
import { QrExportButton } from './qr-export-button'
import { QrListFilters } from './qr-list-filters'
import { useQrLogColumns } from './qr-logs-columns'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

const FILTERS = ['campaign_id', 'result', 'ip', 'date_from', 'date_to']

export function QrLogsPage({ search, navigate }: Props) {
  const { t } = useTranslation('qrcode_event')
  const { exportLogs } = useQrMutations()
  const columns = useQrLogColumns()
  const params = toServerListParams(search, { filters: FILTERS })
  const { data } = useQrLogs(params)

  const toolbarFilters = useMemo(
    () => [
      {
        columnId: 'result',
        title: t('logs.columns.result'),
        mode: 'single' as const,
        options: CHECK_RESULTS.map((r) => ({ label: t(`result.${r}`), value: r })),
      },
    ],
    [t]
  )

  return (
    <AdminPageShell
      title={t('logs.title')}
      description={t('logs.description')}
      actions={<QrExportButton onExport={() => exportLogs.mutate(params)} isPending={exportLogs.isPending} />}
    >
      <QrListFilters search={search} navigate={navigate} withIp />
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('logs.search')}
        noResultsMessage={t('logs.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        toolbarFilters={toolbarFilters}
        urlColumnFilters={[{ columnId: 'result', searchKey: 'result', type: 'string' }]}
      />
    </AdminPageShell>
  )
}
