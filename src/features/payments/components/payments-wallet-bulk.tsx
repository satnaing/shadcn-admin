import type { Table } from '@tanstack/react-table'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/shared/permissions'
import type { WalletRequest } from '../data/payments.type'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'

/** Bulk approve; already approved rows are skipped, so a request is never credited twice (AEC single approve did). */
export function PaymentsWalletBulk({ table }: { table: Table<WalletRequest> }) {
  const { t } = useTranslation('payments')
  const { approveWallet } = usePaymentsMutations()
  const ids = table
    .getFilteredSelectedRowModel()
    .rows.filter((r) => !r.original.approved)
    .map((r) => r.original.id)

  return (
    <DataTableBulkActions table={table} entityName={t('wallet.entity')}>
      <PermissionGuard permission={PERMISSIONS.PAYMENTS.WALLET_MANAGE}>
        <Button
          size='sm'
          variant='outline'
          disabled={ids.length === 0 || approveWallet.isPending}
          onClick={() => approveWallet.mutate(ids, { onSuccess: () => table.resetRowSelection() })}
        >
          <Check className='me-2 size-4' />
          {t('wallet.approveSelected', { count: ids.length })}
        </Button>
      </PermissionGuard>
    </DataTableBulkActions>
  )
}
