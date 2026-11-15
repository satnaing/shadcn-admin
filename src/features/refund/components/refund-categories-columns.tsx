import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { selectColumn } from '@/components/data-table/select-column'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/shared/permissions'
import type { CategoryRefundItem } from '../data/refund.type'

const h = (key: string) => translatedColumnHeader<CategoryRefundItem, unknown>(`refund:categories.columns.${key}`)

export function useRefundCategoryColumns(onEdit: (category: CategoryRefundItem) => void): ColumnDef<CategoryRefundItem>[] {
  const { t } = useTranslation('refund')

  return useMemo(
    () => [
      selectColumn<CategoryRefundItem>(t('actions.selectAll'), t('actions.selectRow')),
      {
        accessorKey: 'name',
        ...h('name'),
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <img src={row.original.icon} alt='' loading='lazy' width={28} height={28} className='size-7 rounded object-cover' />
            <span className='font-medium'>{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'parent_name',
        enableSorting: false,
        ...h('parent'),
        cell: ({ row }) => row.original.parent_name ?? '—',
      },
      {
        accessorKey: 'refund_days',
        ...h('days'),
        cell: ({ row }) =>
          row.original.refund_days > 0 ? (
            t('categories.days', { count: row.original.refund_days })
          ) : (
            <Badge variant='outline'>{t('categories.notRefundable')}</Badge>
          ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PermissionGuard permission={PERMISSIONS.REFUND.CATEGORIES}>
            <div className='flex justify-end'>
              <Button variant='ghost' size='icon' aria-label={t('actions.edit')} onClick={() => onEdit(row.original)}>
                <Pencil className='size-4' />
              </Button>
            </div>
          </PermissionGuard>
        ),
      },
    ],
    [onEdit, t]
  )
}
