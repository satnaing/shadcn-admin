import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import type { SettlementItem } from '../data/courier.type'
import { CourierList } from './courier-list'

const h = (key: string) =>
  translatedColumnHeader<SettlementItem, unknown>(`courier:columns.${key}`)

interface Props {
  /** `payments` = paid out to couriers, `collections` = cash collected from couriers. */
  kind: 'payments' | 'collections'
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** History of payouts / cash collections (AEC lists both for admins and, filtered to themselves, for couriers). */
export function CourierSettlementsPage({ kind, search, navigate }: Props) {
  const { formatMoney } = useCurrencyFormatter()
  const columns = useMemo<ColumnDef<SettlementItem>[]>(
    () => [
      { accessorKey: 'courier_name', ...h('courier') },
      {
        accessorKey: 'amount',
        ...h(kind === 'payments' ? 'paidAmount' : 'collectedAmount'),
        cell: ({ row }) => formatMoney(row.original.amount),
      },
      {
        accessorKey: 'created_at',
        ...h('createdAt'),
        cell: ({ row }) =>
          row.original.created_at.slice(0, 16).replace('T', ' '),
      },
    ],
    [kind, formatMoney]
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
