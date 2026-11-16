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
import type { PayoutMethod } from '../data/payments.type'
import { usePaymentsPayouts } from '../hooks/use-payments'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'
import { usePaymentsPayoutColumns } from './payments-payout-columns'
import { PaymentsPayoutBulk } from './payments-payout-bulk'
import { PaymentsPayoutDialog } from './payments-payout-dialog'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Refund payout methods offered to customers; deleting asks first (AEC deleted through a GET link). */
export function PaymentsPayoutPage({ search, navigate }: Props) {
  const { t } = useTranslation('payments')
  const [editing, setEditing] = useState<PayoutMethod | null | undefined>(undefined)
  const [removing, setRemoving] = useState<PayoutMethod | null>(null)
  const { removePayouts } = usePaymentsMutations()
  const columns = usePaymentsPayoutColumns(setEditing, setRemoving)
  const { data } = usePaymentsPayouts(toServerListParams(search, { filters: [] }))

  return (
    <AdminPageShell
      title={t('payouts.title')}
      description={t('payouts.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.PAYMENTS.PAYOUT_METHODS_MANAGE}>
          <Button onClick={() => setEditing(null)}>
            <Plus className='me-2 size-4' />
            {t('payouts.add')}
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
        searchPlaceholder={t('payouts.search')}
        noResultsMessage={t('payouts.empty')}
        enableStatusFilter={false}
        BulkActions={PaymentsPayoutBulk}
      />
      {editing !== undefined && (
        <PaymentsPayoutDialog key={editing?.id ?? 'new'} open onOpenChange={(open) => !open && setEditing(undefined)} method={editing} />
      )}
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('payouts.deleteTitle')}
        desc={t('payouts.deleteDesc', { name: removing?.name })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removePayouts.isPending}
        handleConfirm={() => removing && removePayouts.mutate([removing.id], { onSettled: () => setRemoving(null) })}
      />
    </AdminPageShell>
  )
}
