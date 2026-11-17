import { useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { selectColumn } from '@/components/data-table/select-column'
import { PermissionGuard } from '@/components/guard'
import type { ProductFlag, WholesaleProduct } from '../data/wholesale.type'
import { WholesaleFlagSwitch } from './wholesale-flag-switch'

const h = (key: string) =>
  translatedColumnHeader<WholesaleProduct, unknown>(`wholesale:columns.${key}`)
const { EDIT, DELETE } = PERMISSIONS.WHOLESALE

export function useWholesaleProductColumns(
  owner: string,
  onFlag: (p: WholesaleProduct, flag: ProductFlag, value: boolean) => void,
  onDelete: (p: WholesaleProduct) => void
): ColumnDef<WholesaleProduct>[] {
  const { t } = useTranslation('wholesale')
  const { formatMoney } = useCurrencyFormatter()
  const navigate = useNavigate()

  return useMemo(() => {
    const flag = (
      id: ProductFlag,
      key: string
    ): ColumnDef<WholesaleProduct> => ({
      id,
      enableSorting: false,
      ...h(key),
      cell: ({ row }) => (
        <WholesaleFlagSwitch
          permission={EDIT}
          checked={row.original[id]}
          label={t(`columns.${key}`)}
          onChange={(v) => onFlag(row.original, id, v)}
        />
      ),
    })
    const columns: ColumnDef<WholesaleProduct>[] = [
      selectColumn<WholesaleProduct>(
        t('actions.selectAll'),
        t('actions.selectRow')
      ),
      {
        accessorKey: 'name',
        ...h('product'),
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {row.original.thumbnail && (
              <img
                src={row.original.thumbnail}
                alt=''
                loading='lazy'
                width={40}
                height={40}
                className='size-10 rounded border object-cover'
              />
            )}
            <Link
              to='/admin/wholesale/$id'
              params={{ id: String(row.original.id) }}
              className='line-clamp-2 max-w-72 font-medium hover:underline'
            >
              {row.original.name}
            </Link>
          </div>
        ),
      },
      { accessorKey: 'owner_name', enableSorting: false, ...h('owner') },
      { accessorKey: 'num_of_sale', ...h('sales') },
      {
        accessorKey: 'unit_price',
        ...h('price'),
        cell: ({ row }) => formatMoney(row.original.unit_price),
      },
      { accessorKey: 'rating', ...h('rating') },
      {
        id: 'tiers',
        enableSorting: false,
        ...h('tiers'),
        cell: ({ row }) => row.original.tiers_count,
      },
      {
        id: 'stock',
        enableSorting: false,
        ...h('stock'),
        cell: ({ row }) => (
          <span className='flex items-center gap-1'>
            {row.original.stock}
            {row.original.stock <= row.original.low_stock_quantity && (
              <Badge variant='destructive'>{t('state.low')}</Badge>
            )}
          </span>
        ),
      },
      flag('is_todays_deal', 'todaysDeal'),
      flag('is_published', 'published'),
      flag('is_approved', 'approved'),
      flag('is_featured', 'featured'),
      // filter-only column: the toolbar filter (?seller=) needs a column id
      {
        id: 'seller',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: () => null,
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end gap-1'>
            <PermissionGuard permission={EDIT}>
              <Button
                variant='ghost'
                size='icon'
                aria-label={t('actions.edit')}
                onClick={() =>
                  navigate({
                    to: '/admin/wholesale/$id',
                    params: { id: String(row.original.id) },
                  })
                }
              >
                <Pencil className='size-4' />
              </Button>
            </PermissionGuard>
            <PermissionGuard permission={DELETE}>
              <Button
                variant='ghost'
                size='icon'
                aria-label={t('actions.delete')}
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className='size-4' />
              </Button>
            </PermissionGuard>
          </div>
        ),
      },
    ]

    // Owner column only where it adds information; approval only matters for seller products.
    return columns.filter(
      (c) =>
        !(
          owner === 'inhouse' &&
          'accessorKey' in c &&
          c.accessorKey === 'owner_name'
        ) && !(owner !== 'seller' && c.id === 'is_approved')
    )
  }, [owner, onFlag, onDelete, navigate, t, formatMoney])
}
