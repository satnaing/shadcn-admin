import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import type { CancelRequestItem } from '../data/courier.type'
import { CourierList } from './courier-list'

const h = (key: string) =>
  translatedColumnHeader<CancelRequestItem, unknown>(`courier:columns.${key}`)

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Orders a courier asked to cancel. The decision itself belongs to the order screen (orders module). */
export function CourierCancelRequestsPage({ search, navigate }: Props) {
  const columns = useMemo<ColumnDef<CancelRequestItem>[]>(
    () => [
      // shortcut: plain #code until the orders module has a detail route to link to
      {
        accessorKey: 'order_code',
        ...h('order'),
        cell: ({ row }) => `#${row.original.order_code}`,
      },
      { accessorKey: 'courier_name', ...h('requestedBy') },
      {
        accessorKey: 'requested_at',
        ...h('requestedAt'),
        cell: ({ row }) =>
          row.original.requested_at.slice(0, 16).replace('T', ' '),
      },
    ],
    []
  )

  return (
    <CourierList
      kind='cancelRequests'
      columns={columns}
      defaultSort='requested_at'
      search={search}
      navigate={navigate}
    />
  )
}
