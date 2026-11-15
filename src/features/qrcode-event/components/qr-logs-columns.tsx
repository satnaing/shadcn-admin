import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import type { CheckItem } from '../data/qrcode-event.type'
import { QrBadge } from './qr-badge'

const h = (key: string) => translatedColumnHeader<CheckItem, unknown>(`qrcode_event:logs.columns.${key}`)

export function useQrLogColumns(): ColumnDef<CheckItem>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'created_at',
        ...h('at'),
        cell: ({ row }) => row.original.created_at.slice(0, 16).replace('T', ' '),
      },
      {
        accessorKey: 'code_input',
        ...h('code'),
        cell: ({ row }) =>
          row.original.qr_code_id ? (
            <Link
              className='font-mono underline-offset-4 hover:underline'
              to='/admin/qrcode-event/codes/$id'
              params={{ id: String(row.original.qr_code_id) }}
            >
              {row.original.code_input}
            </Link>
          ) : (
            <span className='font-mono'>{row.original.code_input}</span>
          ),
      },
      {
        id: 'result',
        accessorKey: 'result',
        enableSorting: false,
        ...h('result'),
        cell: ({ row }) => <QrBadge group='result' value={row.original.result} />,
      },
      { accessorKey: 'campaign_name', enableSorting: false, ...h('campaign') },
      { accessorKey: 'user_name', enableSorting: false, ...h('user'), cell: ({ row }) => row.original.user_name ?? '—' },
      { accessorKey: 'ip', ...h('ip'), cell: ({ row }) => <span className='font-mono'>{row.original.ip}</span> },
      { accessorKey: 'source', enableSorting: false, ...h('source') },
    ],
    []
  )
}
