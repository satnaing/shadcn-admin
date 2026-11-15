import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import type { BatchItem } from '../data/qrcode-event.type'
import { QrBatchActions } from './qr-batch-actions'

const h = (key: string) => translatedColumnHeader<BatchItem, unknown>(`qrcode_event:batches.columns.${key}`)

export function useQrBatchColumns(): ColumnDef<BatchItem>[] {
  return useMemo(
    () => [
      { accessorKey: 'id', ...h('id'), cell: ({ row }) => `#${row.original.id}` },
      { accessorKey: 'campaign_name', ...h('campaign') },
      { accessorKey: 'quantity', ...h('quantity'), cell: ({ row }) => row.original.quantity.toLocaleString() },
      { accessorKey: 'winner_quantity', ...h('winners') },
      { accessorKey: 'note', enableSorting: false, ...h('note') },
      { accessorKey: 'created_by_name', enableSorting: false, ...h('createdBy') },
      { accessorKey: 'created_at', ...h('createdAt'), cell: ({ row }) => row.original.created_at.slice(0, 10) },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end'>
            <QrBatchActions batch={row.original} />
          </div>
        ),
      },
    ],
    []
  )
}
