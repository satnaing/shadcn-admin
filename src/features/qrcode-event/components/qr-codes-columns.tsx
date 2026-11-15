import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Power } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/shared/permissions'
import type { CodeListItem } from '../data/qrcode-event.type'
import { QrBadge } from './qr-badge'

const h = (key: string) => translatedColumnHeader<CodeListItem, unknown>(`qrcode_event:codes.columns.${key}`)

export function useQrCodeColumns(onToggle: (code: CodeListItem) => void): ColumnDef<CodeListItem>[] {
  const { t } = useTranslation('qrcode_event')

  return useMemo(
    () => [
      {
        accessorKey: 'code',
        ...h('code'),
        cell: ({ row }) => <span className='font-mono'>{row.original.code}</span>,
      },
      { accessorKey: 'campaign_name', enableSorting: false, ...h('campaign') },
      {
        id: 'status',
        accessorKey: 'status',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) => <QrBadge group='code' value={row.original.status} />,
      },
      {
        id: 'winner',
        accessorKey: 'prize_id',
        enableSorting: false,
        ...h('prize'),
        cell: ({ row }) => row.original.prize_title ?? '—',
      },
      { accessorKey: 'user_name', enableSorting: false, ...h('user'), cell: ({ row }) => row.original.user_name ?? '—' },
      {
        accessorKey: 'checked_at',
        ...h('checkedAt'),
        cell: ({ row }) => row.original.checked_at?.slice(0, 16).replace('T', ' ') ?? '—',
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end gap-1'>
            <Button asChild variant='ghost' size='icon' aria-label={t('actions.view')}>
              <Link to='/admin/qrcode-event/codes/$id' params={{ id: String(row.original.id) }}>
                <Eye className='size-4' />
              </Link>
            </Button>
            <PermissionGuard permission={PERMISSIONS.QRCODE_EVENT.CODES_MANAGE}>
              <Button
                variant='ghost'
                size='icon'
                aria-label={t(row.original.status === 'disabled' ? 'codes.enable' : 'codes.disable')}
                onClick={() => onToggle(row.original)}
              >
                <Power className='size-4' />
              </Button>
            </PermissionGuard>
          </div>
        ),
      },
    ],
    [t, onToggle]
  )
}
