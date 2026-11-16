import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PERMISSIONS } from '@/shared/permissions'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { selectColumn } from '@/components/data-table/select-column'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PosProductItem } from '../data/pos.type'

const h = (key: string) => translatedColumnHeader<PosProductItem, unknown>(`pos:products.columns.${key}`)

/** Filter-only column: a toolbar filter (`?category=`) needs a column id. */
const filterColumn = (id: string): ColumnDef<PosProductItem> => ({
  id,
  enableSorting: false,
  enableHiding: false,
  header: () => null,
  cell: () => null,
})

export function usePosProductColumns(onRemove: (p: PosProductItem) => void): ColumnDef<PosProductItem>[] {
  const { t } = useTranslation('pos')
  const { formatMoney } = useCurrencyFormatter()

  return useMemo(
    () => [
      selectColumn<PosProductItem>(t('actions.selectAll'), t('actions.selectRow')),
      { accessorKey: 'name', ...h('name') },
      { accessorKey: 'category', enableSorting: false, ...h('category') },
      {
        accessorKey: 'seller',
        enableSorting: false,
        ...h('seller'),
        cell: ({ row }) =>
          row.original.seller_id === null ? (
            <Badge variant='secondary'>{t('products.inhouse')}</Badge>
          ) : (
            row.original.seller
          ),
      },
      {
        accessorKey: 'unit_price',
        ...h('price'),
        cell: ({ row }) => formatMoney(row.original.unit_price),
      },
      {
        accessorKey: 'stock_qty',
        enableSorting: false,
        ...h('stock'),
        cell: ({ row }) =>
          row.original.stock_qty > 0 ? (
            row.original.stock_qty
          ) : (
            <Badge variant='destructive'>{t('grid.outOfStock')}</Badge>
          ),
      },
      { accessorKey: 'rating', ...h('rating') },
      filterColumn('categoryFilter'),
      filterColumn('sellerFilter'),
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PermissionGuard permission={PERMISSIONS.POS.PRODUCTS_MANAGE}>
            <Button size='icon' variant='ghost' aria-label={t('products.remove')} onClick={() => onRemove(row.original)}>
              <Trash2 className='size-4' />
            </Button>
          </PermissionGuard>
        ),
      },
    ],
    [t, formatMoney, onRemove]
  )
}
