import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { selectColumn } from '@/components/data-table/select-column'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS } from '@/shared/permissions'
import { LOCALES, type ReasonItem } from '../data/refund.type'
import { RefundBadge } from './refund-badge'

const h = (key: string) => translatedColumnHeader<ReasonItem, unknown>(`refund:reasons.columns.${key}`)

export function useRefundReasonColumns(
  onToggle: (reason: ReasonItem) => void,
  onEdit: (reason: ReasonItem) => void,
  onDelete: (reason: ReasonItem) => void
): ColumnDef<ReasonItem>[] {
  const { t } = useTranslation('refund')

  return useMemo(
    () => [
      selectColumn<ReasonItem>(t('actions.selectAll'), t('actions.selectRow')),
      {
        accessorKey: 'kind',
        enableSorting: false,
        ...h('kind'),
        cell: ({ row }) => <RefundBadge group='kind' value={row.original.kind} />,
      },
      { accessorKey: 'reason', ...h('reason') },
      {
        id: 'languages',
        enableSorting: false,
        ...h('languages'),
        cell: ({ row }) => (
          <div className='flex gap-1'>
            {LOCALES.map((l) => (
              <Badge key={l} variant={row.original.translations[l] ? 'default' : 'outline'} className='uppercase'>
                {l}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        id: 'is_active',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) => (
          <PermissionGuard
            permission={PERMISSIONS.REFUND.REASONS_MANAGE}
            fallback={<RefundBadge group='status' value={row.original.is_active ? 'approved' : 'rejected'} />}
          >
            <Switch checked={row.original.is_active} onCheckedChange={() => onToggle(row.original)} aria-label={t('reasons.columns.status')} />
          </PermissionGuard>
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PermissionGuard permission={PERMISSIONS.REFUND.REASONS_MANAGE}>
            <div className='flex justify-end gap-1'>
              <Button variant='ghost' size='icon' aria-label={t('actions.edit')} onClick={() => onEdit(row.original)}>
                <Pencil className='size-4' />
              </Button>
              <Button variant='ghost' size='icon' aria-label={t('actions.delete')} onClick={() => onDelete(row.original)}>
                <Trash2 className='size-4' />
              </Button>
            </div>
          </PermissionGuard>
        ),
      },
    ],
    [onToggle, onEdit, onDelete, t]
  )
}
