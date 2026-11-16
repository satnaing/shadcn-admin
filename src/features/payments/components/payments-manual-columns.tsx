import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/shared/permissions'
import type { ManualMethod } from '../data/payments.type'

const h = (key: string) => translatedColumnHeader<ManualMethod, unknown>(`payments:manual.columns.${key}`)

export function usePaymentsManualColumns(
  onEdit: (m: ManualMethod) => void,
  onDelete: (m: ManualMethod) => void
): ColumnDef<ManualMethod>[] {
  const { t } = useTranslation('payments')

  return useMemo(
    () => [
      {
        accessorKey: 'heading',
        ...h('heading'),
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {row.original.photo && (
              <img src={row.original.photo} alt='' loading='lazy' width={64} height={34} className='h-9 w-16 rounded border object-cover' />
            )}
            <span className='font-medium'>{row.original.heading}</span>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        ...h('type'),
        cell: ({ row }) => <Badge variant='secondary'>{t(`manual.types.${row.original.type}`)}</Badge>,
      },
      {
        id: 'banks',
        enableSorting: false,
        ...h('banks'),
        cell: ({ row }) => (row.original.type === 'bank_payment' ? row.original.bank_info.length : '—'),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PermissionGuard permission={PERMISSIONS.PAYMENTS.MANUAL_MANAGE}>
            <div className='flex justify-end gap-1'>
              <Button size='icon' variant='ghost' aria-label={t('actions.edit')} onClick={() => onEdit(row.original)}>
                <Pencil className='size-4' />
              </Button>
              <Button size='icon' variant='ghost' aria-label={t('actions.delete')} onClick={() => onDelete(row.original)}>
                <Trash2 className='size-4 text-destructive' />
              </Button>
            </div>
          </PermissionGuard>
        ),
      },
    ],
    [t, onEdit, onDelete]
  )
}
