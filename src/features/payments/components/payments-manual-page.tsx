import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import type { ManualMethod } from '../data/payments.type'
import { usePaymentsManual } from '../hooks/use-payments'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'
import { usePaymentsManualColumns } from './payments-manual-columns'
import { PaymentsManualDialog } from './payments-manual-dialog'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Manual (offline) payment methods shown at checkout: bank transfer, cheque or custom instructions. */
export function PaymentsManualPage({ search, navigate }: Props) {
  const { t } = useTranslation('payments')
  const [editing, setEditing] = useState<ManualMethod | null | undefined>(undefined)
  const [removing, setRemoving] = useState<ManualMethod | null>(null)
  const { removeManual } = usePaymentsMutations()
  const columns = usePaymentsManualColumns(setEditing, setRemoving)
  const { data } = usePaymentsManual(toServerListParams(search, { filters: [] }))

  return (
    <AdminPageShell
      title={t('manual.title')}
      description={t('manual.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.PAYMENTS.MANUAL_MANAGE}>
          <Button onClick={() => setEditing(null)}>
            <Plus className='me-2 size-4' />
            {t('manual.add')}
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
        searchPlaceholder={t('manual.search')}
        noResultsMessage={t('manual.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
      />
      {editing !== undefined && (
        <PaymentsManualDialog
          key={editing?.id ?? 'new'}
          open
          onOpenChange={(open) => !open && setEditing(undefined)}
          method={editing}
        />
      )}
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('manual.deleteTitle')}
        desc={t('manual.deleteDesc', { name: removing?.heading })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removeManual.isPending}
        handleConfirm={() => removing && removeManual.mutate(removing.id, { onSettled: () => setRemoving(null) })}
      />
    </AdminPageShell>
  )
}
