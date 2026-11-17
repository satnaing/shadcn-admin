import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/permissions'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { PermissionGuard } from '@/components/guard'
import type { ClassifiedProduct } from '../data/classified.type'
import { useClassifiedMutations } from '../hooks/use-classified-mutations'

/** Bulk delete of the selected listings (AEC bulk-classified-products-delete), behind a confirmation. */
export function ClassifiedProductsBulkActions({
  table,
}: {
  table: Table<ClassifiedProduct>
}) {
  const { t } = useTranslation('classified')
  const [confirming, setConfirming] = useState(false)
  const { removeProducts } = useClassifiedMutations()
  const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id)

  return (
    <DataTableBulkActions table={table} entityName={t('products.entity')}>
      <PermissionGuard permission={PERMISSIONS.CLASSIFIED.DELETE}>
        <Button
          size='sm'
          variant='destructive'
          onClick={() => setConfirming(true)}
        >
          <Trash2 className='me-2 size-4' />
          {t('actions.delete')}
        </Button>
      </PermissionGuard>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={t('products.bulkDeleteTitle')}
        desc={t('products.bulkDeleteDesc', { count: ids.length })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removeProducts.isPending}
        handleConfirm={() =>
          removeProducts.mutate(ids, {
            onSuccess: () => table.resetRowSelection(),
            onSettled: () => setConfirming(false),
          })
        }
      />
    </DataTableBulkActions>
  )
}
