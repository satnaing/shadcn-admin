import type { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PERMISSIONS } from '@/shared/permissions'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import type { PosProductItem } from '../data/pos.type'

interface Props {
  table: Table<PosProductItem>
  /** Opens the confirmation for the selected ids (AEC asks before removing from POS). */
  onRemove: (ids: number[], reset: () => void) => void
}

export function PosProductsBulkActions({ table, onRemove }: Props) {
  const { t } = useTranslation('pos')
  const ids = table.getFilteredSelectedRowModel().rows.map((r) => r.original.id)

  return (
    <DataTableBulkActions table={table} entityName={t('products.entity')}>
      <PermissionGuard permission={PERMISSIONS.POS.PRODUCTS_MANAGE}>
        <Button size='sm' variant='destructive' onClick={() => onRemove(ids, () => table.resetRowSelection())}>
          <Trash2 className='me-2 size-4' />
          {t('products.removeSelected')}
        </Button>
      </PermissionGuard>
    </DataTableBulkActions>
  )
}
