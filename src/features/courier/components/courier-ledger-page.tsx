import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Badge } from '@/components/ui/badge'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import type { LedgerItem } from '../data/courier.type'
import { CourierList } from './courier-list'

const h = (key: string) =>
  translatedColumnHeader<LedgerItem, unknown>(`courier:columns.${key}`)

interface Props {
  /** `cash` = cash-on-delivery money the courier collected, `earnings` = what each delivery earned. */
  kind: 'cash' | 'earnings'
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** The signed-in courier's report over delivered orders. */
export function CourierLedgerPage({ kind, search, navigate }: Props) {
  const { t } = useTranslation('courier')
  const { formatMoney } = useCurrencyFormatter()
  const columns = useMemo<ColumnDef<LedgerItem>[]>(
    () => [
      {
        accessorKey: 'order_code',
        ...h('order'),
        cell: ({ row }) => `#${row.original.order_code}`,
      },
      {
        accessorKey: 'payment_type',
        enableSorting: false,
        ...h('payment'),
        cell: ({ row }) => (
          <Badge variant='outline'>
            {t(`payment.${row.original.payment_type}`)}
          </Badge>
        ),
      },
      {
        accessorKey: 'amount',
        ...h(kind === 'cash' ? 'collection' : 'earning'),
        cell: ({ row }) => formatMoney(row.original.amount),
      },
      {
        accessorKey: 'created_at',
        ...h('deliveredAt'),
        cell: ({ row }) =>
          row.original.created_at.slice(0, 16).replace('T', ' '),
      },
    ],
    [t, kind, formatMoney]
  )

  return (
    <CourierList
      kind={kind}
      columns={columns}
      defaultSort='created_at'
      search={search}
      navigate={navigate}
    />
  )
}
