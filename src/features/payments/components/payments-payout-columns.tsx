import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { selectColumn } from '@/components/data-table/select-column'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/shared/permissions'
import type { PayoutMethod } from '../data/payments.type'

const h = (key: string) => translatedColumnHeader<PayoutMethod, unknown>(`payments:payouts.columns.${key}`)

export function usePaymentsPayoutColumns(
  onEdit: (m: PayoutMethod) => void,
  onDelete: (m: PayoutMethod) => void
): ColumnDef<PayoutMethod>[] {
  const { t } = useTranslation('payments')

  return useMemo(
    () => [
      selectColumn<PayoutMethod>(t('common.selectAll'), t('common.selectRow')),
      {
        accessorKey: 'logo',
        enableSorting: false,
        ...h('logo'),
        cell: ({ row }) =>
          row.original.logo ? (
            <img src={row.original.logo} alt='' loading='lazy' width={36} height={36} className='size-9 rounded border object-contain' />
          ) : null,
      },
      { accessorKey: 'type', ...h('type'), cell: ({ row }) => <Badge variant='secondary'>{t(`payouts.types.${row.original.type}`)}</Badge> },
      { accessorKey: 'name', ...h('name'), cell: ({ row }) => <span className='font-medium'>{row.original.name}</span> },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PermissionGuard permission={PERMISSIONS.PAYMENTS.PAYOUT_METHODS_MANAGE}>
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
