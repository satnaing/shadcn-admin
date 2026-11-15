import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import type { CampaignListItem, CampaignStatus } from '../data/qrcode-event.type'
import { QrBadge } from './qr-badge'
import { QrCampaignActions } from './qr-campaign-actions'

const h = (key: string) => translatedColumnHeader<CampaignListItem, unknown>(`qrcode_event:campaigns.columns.${key}`)
const period = (c: CampaignListItem) =>
  [c.starts_at, c.ends_at].map((d) => d?.slice(0, 10) ?? '…').join(' → ')

export function useQrCampaignColumns(
  onStatus: (campaign: CampaignListItem, status: CampaignStatus) => void,
  onDelete: (campaign: CampaignListItem) => void
): ColumnDef<CampaignListItem>[] {
  return useMemo(
    () => [
      {
        accessorKey: 'name',
        ...h('name'),
        cell: ({ row }) => (
          <div className='min-w-0'>
            <div className='truncate font-medium'>{row.original.name}</div>
            <div className='truncate text-xs text-muted-foreground'>{row.original.slug}</div>
          </div>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) => <QrBadge group='campaign' value={row.original.status} />,
      },
      { id: 'period', enableSorting: false, ...h('period'), cell: ({ row }) => period(row.original) },
      {
        accessorKey: 'code_prefix',
        ...h('prefix'),
        cell: ({ row }) => <span className='font-mono'>{row.original.code_prefix ?? '—'}</span>,
      },
      { accessorKey: 'prizes_count', ...h('prizes') },
      {
        accessorKey: 'codes_count',
        ...h('codes'),
        cell: ({ row }) => `${row.original.checked_count} / ${row.original.codes_count}`,
      },
      { accessorKey: 'claimed_count', ...h('claimed') },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end'>
            <QrCampaignActions
              campaign={row.original}
              onStatus={(s) => onStatus(row.original, s)}
              onDelete={() => onDelete(row.original)}
            />
          </div>
        ),
      },
    ],
    [onStatus, onDelete]
  )
}
