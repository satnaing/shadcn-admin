import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { PermissionGuard } from '@/components/guard'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { CODE_STATUSES, type CodeListItem } from '../data/qrcode-event.type'
import { useQrCodes } from '../hooks/use-qrcode-event'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'
import { useQrCodeColumns } from './qr-codes-columns'
import { QrExportButton } from './qr-export-button'
import { QrListFilters } from './qr-list-filters'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

const FILTERS = ['campaign_id', 'batch_id', 'status', 'winner', 'prize_id', 'date_from', 'date_to']

export function QrCodesPage({ search, navigate }: Props) {
  const { t } = useTranslation('qrcode_event')
  const { toggleCode, exportCodes } = useQrMutations()
  const onToggle = useCallback((c: CodeListItem) => toggleCode.mutate(c.id), [toggleCode])
  const columns = useQrCodeColumns(onToggle)
  const params = toServerListParams(search, { filters: FILTERS })
  const { data } = useQrCodes(params)

  const toolbarFilters = useMemo(
    () => [
      {
        columnId: 'status',
        title: t('codes.columns.status'),
        mode: 'single' as const,
        options: CODE_STATUSES.map((s) => ({ label: t(`code.${s}`), value: s })),
      },
      {
        columnId: 'winner',
        title: t('codes.columns.prize'),
        mode: 'single' as const,
        options: [
          { label: t('codes.winnersOnly'), value: '1' },
          { label: t('codes.nonWinners'), value: '0' },
        ],
      },
    ],
    [t]
  )

  return (
    <AdminPageShell
      title={t('codes.title')}
      description={t('codes.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.QRCODE_EVENT.LOGS}>
          <QrExportButton onExport={() => exportCodes.mutate(params)} isPending={exportCodes.isPending} />
        </PermissionGuard>
      }
    >
      <QrListFilters search={search} navigate={navigate} />
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('codes.search')}
        noResultsMessage={t('codes.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        toolbarFilters={toolbarFilters}
        urlColumnFilters={[
          { columnId: 'status', searchKey: 'status', type: 'string' },
          { columnId: 'winner', searchKey: 'winner', type: 'string' },
        ]}
      />
    </AdminPageShell>
  )
}
