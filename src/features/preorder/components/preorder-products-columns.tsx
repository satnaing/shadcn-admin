import { useMemo } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { selectColumn } from '@/components/data-table/select-column'
import type { ProductFlag, ProductListItem } from '../data/preorder.type'
import { OwnerBadge } from './preorder-badge'
import { FlagSwitch } from './preorder-flag-switch'
import { PreorderProductTerms } from './preorder-product-terms'
import { PreorderRowButtons } from './preorder-row-buttons'

const h = (key: string) =>
  translatedColumnHeader<ProductListItem, unknown>(
    `preorder:products.columns.${key}`
  )
const MANAGE = PERMISSIONS.PREORDER.PRODUCTS_MANAGE

export function usePreorderProductColumns(
  onFlag: (p: ProductListItem, flag: ProductFlag, value: boolean) => void,
  onDelete: (p: ProductListItem) => void
): ColumnDef<ProductListItem>[] {
  const { t } = useTranslation('preorder')
  const { formatMoney } = useCurrencyFormatter()
  const navigate = useNavigate()
  return useMemo(() => {
    const flag = (
      id: ProductFlag,
      key: string
    ): ColumnDef<ProductListItem> => ({
      id,
      enableSorting: false,
      ...h(key),
      cell: ({ row }) => {
        const p = row.original
        const checked = id === 'approval' ? p.approval === 'approved' : p[id]

        return (
          <FlagSwitch
            permission={MANAGE}
            checked={checked}
            label={t(`products.columns.${key}`)}
            onChange={(v) => onFlag(p, id, v)}
          />
        )
      },
    })

    return [
      selectColumn<ProductListItem>(
        t('actions.selectAll'),
        t('actions.selectRow')
      ),
      {
        accessorKey: 'name',
        ...h('product'),
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <img
              src={row.original.image}
              alt=''
              loading='lazy'
              width={40}
              height={40}
              className='size-10 rounded border object-cover'
            />
            <div className='min-w-0'>
              <Link
                to='/admin/preorder/products/$id'
                params={{ id: String(row.original.id) }}
                className='line-clamp-1 font-medium hover:underline'
              >
                {row.original.name}
              </Link>
              <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                <OwnerBadge type={row.original.owner_type} />{' '}
                {row.original.category_name}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'unit_price',
        ...h('price'),
        cell: ({ row }) => {
          const p = row.original

          return (
            <div>
              {formatMoney(p.unit_price)}
              {p.discount > 0 && (
                <div className='text-xs text-muted-foreground'>
                  −{p.discount}
                  {p.discount_type === 'percent' ? '%' : ''}
                </div>
              )}
            </div>
          )
        },
      },
      {
        id: 'terms',
        enableSorting: false,
        ...h('terms'),
        cell: ({ row }) => <PreorderProductTerms product={row.original} />,
      },
      { accessorKey: 'available_date', ...h('available') },
      { accessorKey: 'orders_count', ...h('orders') },
      flag('approval', 'approval'),
      flag('is_published', 'published'),
      flag('is_featured', 'featured'),
      flag('is_show_on_homepage', 'homepage'),
      // filter-only column: the toolbar filter (?state=) needs a column id
      {
        id: 'state',
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
          <PreorderRowButtons
            permission={MANAGE}
            onEdit={() =>
              navigate({
                to: '/admin/preorder/products/$id',
                params: { id: String(row.original.id) },
              })
            }
            onDelete={() => onDelete(row.original)}
          />
        ),
      },
    ] satisfies ColumnDef<ProductListItem>[]
  }, [onFlag, onDelete, navigate, t, formatMoney])
}
