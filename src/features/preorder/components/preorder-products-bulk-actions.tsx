import type { Table } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/permissions'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { PermissionGuard } from '@/components/guard'
import type { ProductListItem } from '../data/preorder.type'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'

/** Bulk delete of the selected preorder products (AEC `bulk-destroy`). */
export function PreorderProductsBulkActions({
  table,
}: {
  table: Table<ProductListItem>
}) {
  const { t } = useTranslation('preorder')
  const { bulkRemoveProducts } = usePreorderMutations()
  const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id)

  return (
    <DataTableBulkActions table={table} entityName={t('products.entity')}>
      <PermissionGuard permission={PERMISSIONS.PREORDER.PRODUCTS_MANAGE}>
        <Button
          size='sm'
          variant='destructive'
          disabled={bulkRemoveProducts.isPending}
          onClick={() =>
            bulkRemoveProducts.mutate(ids, {
              onSuccess: () => table.resetRowSelection(),
            })
          }
        >
          <Trash2 className='me-2 size-4' />
          {t('actions.deleteSelected')}
        </Button>
      </PermissionGuard>
    </DataTableBulkActions>
  )
}
