import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useQrBatches } from '../hooks/use-qrcode-event'
import { useQrBatchColumns } from './qr-batches-columns'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function QrBatchesPage({ search, navigate }: Props) {
  const { t } = useTranslation('qrcode_event')
  const columns = useQrBatchColumns()
  const { data } = useQrBatches(toServerListParams(search, { filters: ['campaign_id'] }))

  return (
    <AdminPageShell
      title={t('batches.title')}
      description={t('batches.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.QRCODE_EVENT.BATCHES_CREATE}>
          <Button asChild>
            <Link to='/admin/qrcode-event/batches/new'>
              <Plus className='me-2 size-4' />
              {t('batches.new')}
            </Link>
          </Button>
        </PermissionGuard>
      }
    >
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('batches.search')}
        noResultsMessage={t('batches.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
      />
    </AdminPageShell>
  )
}
