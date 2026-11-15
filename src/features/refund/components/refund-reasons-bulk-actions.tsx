import type { Table } from '@tanstack/react-table'
import { Power, PowerOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { Button } from '@/components/ui/button'
import type { ReasonItem } from '../data/refund.type'
import { useRefundMutations } from '../hooks/use-refund-mutations'

/** Bulk activate / deactivate of the selected reasons (AEC `bulk_update`, but explicit instead of a blind toggle). */
export function RefundReasonsBulkActions({ table }: { table: Table<ReasonItem> }) {
  const { t } = useTranslation('refund')
  const { setReasonsActive } = useRefundMutations()
  const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id)
  const run = (active: boolean) =>
    setReasonsActive.mutate({ ids, active }, { onSuccess: () => table.resetRowSelection() })

  return (
    <DataTableBulkActions table={table} entityName={t('reasons.entity')}>
      <Button size='sm' variant='outline' disabled={setReasonsActive.isPending} onClick={() => run(true)}>
        <Power className='me-2 size-4' />
        {t('reasons.activate')}
      </Button>
      <Button size='sm' variant='outline' disabled={setReasonsActive.isPending} onClick={() => run(false)}>
        <PowerOff className='me-2 size-4' />
        {t('reasons.deactivate')}
      </Button>
    </DataTableBulkActions>
  )
}
