import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { selectColumn } from '@/components/data-table/select-column'
import { currentStep } from '../data/preorder.helpers'
import type { OrderListItem } from '../data/preorder.type'
import { OwnerBadge, StepBadge } from './preorder-badge'
import { PreorderOrderActions } from './preorder-order-actions'

const h = (key: string) =>
  translatedColumnHeader<OrderListItem, unknown>(
    `preorder:orders.columns.${key}`
  )

export function usePreorderOrderColumns(
  onInvoice: (o: OrderListItem) => void,
  onDelete: (o: OrderListItem) => void
): ColumnDef<OrderListItem>[] {
  const { t } = useTranslation('preorder')
  const { formatMoney } = useCurrencyFormatter()

  return useMemo(
    () => [
      selectColumn<OrderListItem>(
        t('actions.selectAll'),
        t('actions.selectRow')
      ),
      {
        accessorKey: 'code',
        ...h('code'),
        cell: ({ row }) => (
          <div>
            <Link
              to='/admin/preorder/orders/$id'
              params={{ id: String(row.original.id) }}
              className='font-medium text-primary hover:underline'
            >
              {row.original.code}
            </Link>
            {!row.original.is_viewed && (
              <Badge className='ms-2'>{t('orders.new')}</Badge>
            )}
            <div className='text-xs text-muted-foreground'>
              {row.original.created_at.slice(0, 10)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'product_name',
        ...h('product'),
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <img
              src={row.original.product_image}
              alt=''
              loading='lazy'
              width={36}
              height={36}
              className='size-9 rounded border object-cover'
            />
            <div className='min-w-0'>
              <span className='line-clamp-1 max-w-56'>
                {row.original.product_name}
              </span>
              <span className='text-xs text-muted-foreground'>
                × {row.original.quantity}
              </span>
            </div>
          </div>
        ),
      },
      { accessorKey: 'customer_name', ...h('customer') },
      {
        accessorKey: 'owner_name',
        ...h('owner'),
        cell: ({ row }) => (
          <div className='space-y-1'>
            <OwnerBadge type={row.original.owner_type} />
            <div className='text-xs text-muted-foreground'>
              {row.original.owner_name}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'grand_total',
        ...h('total'),
        cell: ({ row }) => (
          <div>
            {formatMoney(row.original.grand_total)}
            {row.original.prepayment_amount > 0 && (
              <div className='text-xs text-muted-foreground'>
                {t('orders.deposit')}{' '}
                {formatMoney(row.original.prepayment_amount)}
              </div>
            )}
          </div>
        ),
      },
      {
        id: 'stage',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) => {
          const cur = currentStep(row.original.steps)

          return cur ? (
            <div className='space-y-1'>
              <div className='text-xs'>{t(`step.${cur.step}`)}</div>
              <StepBadge status={cur.status} />
            </div>
          ) : (
            <StepBadge status='none' />
          )
        },
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PreorderOrderActions
            order={row.original}
            onInvoice={onInvoice}
            onDelete={onDelete}
          />
        ),
      },
    ],
    [onInvoice, onDelete, t, formatMoney]
  )
}
