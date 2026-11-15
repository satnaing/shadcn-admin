import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { RefundKind, RefundListItem } from '../data/refund.type'
import { RefundBadge } from './refund-badge'
import { RefundRowActions } from './refund-row-actions'

const h = (key: string) => translatedColumnHeader<RefundListItem, unknown>(`refund:columns.${key}`)

export function useRefundColumns(
  kind: RefundKind,
  onOpen: (refund: RefundListItem) => void
): ColumnDef<RefundListItem>[] {
  const { t } = useTranslation('refund')
  const { formatMoney } = useCurrencyFormatter()

  return useMemo(
    () => [
      {
        accessorKey: 'code',
        ...h('code'),
        cell: ({ row }) => (
          <div className='min-w-0'>
            <button type='button' className='font-medium text-primary hover:underline' onClick={() => onOpen(row.original)}>
              {row.original.code}
            </button>
            <div className='truncate text-xs text-muted-foreground'>
              {row.original.seller_name} · #{row.original.order_code}
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
            <span className='line-clamp-2 max-w-56'>{row.original.product_name}</span>
          </div>
        ),
      },
      { accessorKey: 'amount', ...h('amount'), cell: ({ row }) => formatMoney(row.original.amount) },
      {
        id: 'approval',
        enableSorting: false,
        ...h('approval'),
        cell: ({ row }) => (
          <div className='space-y-1 text-xs'>
            <div className='flex items-center gap-2'>
              {t('columns.seller')} <RefundBadge group='decision' value={row.original.seller_decision} />
            </div>
            <div className='flex items-center gap-2'>
              {t('columns.admin')} <RefundBadge group='decision' value={row.original.admin_decision} />
            </div>
          </div>
        ),
      },
      {
        id: 'payment',
        enableSorting: false,
        ...h('payment'),
        cell: ({ row }) => {
          const status = kind === 'dispute' ? row.original.dispute_status : row.original.status
          return (
            <div className='flex flex-wrap items-center gap-1'>
              <RefundBadge group='channel' value={row.original.payment_channel} />
              <RefundBadge group='status' value={status ?? 'pending'} />
            </div>
          )
        },
      },
      { accessorKey: 'requested_at', ...h('requestedAt'), cell: ({ row }) => row.original.requested_at.slice(0, 10) },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end'>
            <RefundRowActions refund={row.original} onOpen={onOpen} />
          </div>
        ),
      },
    ],
    [kind, onOpen, t, formatMoney]
  )
}
