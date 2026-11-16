import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/shared/permissions'
import type { PayoutMethod } from '../data/payments.type'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'

/** Bulk delete of the selected payout methods (AEC `bulk_delete`), behind a confirmation. */
export function PaymentsPayoutBulk({ table }: { table: Table<PayoutMethod> }) {
  const { t } = useTranslation('payments')
  const [confirming, setConfirming] = useState(false)
  const { removePayouts } = usePaymentsMutations()
  const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id)

  return (
    <DataTableBulkActions table={table} entityName={t('payouts.entity')}>
      <PermissionGuard permission={PERMISSIONS.PAYMENTS.PAYOUT_METHODS_MANAGE}>
        <Button size='sm' variant='outline' onClick={() => setConfirming(true)}>
          <Trash2 className='me-2 size-4' />
          {t('actions.delete')}
        </Button>
      </PermissionGuard>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={t('payouts.deleteTitle')}
        desc={t('payouts.deleteBulkDesc', { count: ids.length })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removePayouts.isPending}
        handleConfirm={() =>
          removePayouts.mutate(ids, {
            onSuccess: () => table.resetRowSelection(),
            onSettled: () => setConfirming(false),
          })
        }
      />
    </DataTableBulkActions>
  )
}
