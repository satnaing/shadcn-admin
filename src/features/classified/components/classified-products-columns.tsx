import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/permissions'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { selectColumn } from '@/components/data-table/select-column'
import { PermissionGuard } from '@/components/guard'
import type { ClassifiedProduct } from '../data/classified.type'

const h = (key: string) =>
  translatedColumnHeader<ClassifiedProduct, unknown>(
    `classified:columns.${key}`
  )

export function useClassifiedProductColumns(
  onPublish: (product: ClassifiedProduct) => void,
  onDelete: (product: ClassifiedProduct) => void
): ColumnDef<ClassifiedProduct>[] {
  const { t } = useTranslation('classified')

  return useMemo(
    () => [
      selectColumn<ClassifiedProduct>(
        t('actions.selectAll'),
        t('actions.selectRow')
      ),
      { accessorKey: 'name', ...h('name') },
      {
        accessorKey: 'thumbnail',
        enableSorting: false,
        ...h('image'),
        cell: ({ row }) =>
          row.original.thumbnail ? (
            <img
              src={row.original.thumbnail}
              alt={row.original.name}
              className='h-10 w-10 rounded object-cover'
              loading='lazy'
            />
          ) : (
            '—'
          ),
      },
      { accessorKey: 'owner', ...h('owner') },
      {
        accessorKey: 'is_active',
        enableSorting: false,
        ...h('customerStatus'),
        cell: ({ row }) => (
          <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
            {t(
              row.original.is_active ? 'status.published' : 'status.unpublished'
            )}
          </Badge>
        ),
      },
      {
        accessorKey: 'is_published',
        enableSorting: false,
        ...h('published'),
        cell: ({ row }) => (
          <PermissionGuard
            permission={PERMISSIONS.CLASSIFIED.PUBLISH}
            fallback={
              <Badge
                variant={row.original.is_published ? 'default' : 'secondary'}
              >
                {t(
                  row.original.is_published
                    ? 'status.published'
                    : 'status.unpublished'
                )}
              </Badge>
            }
          >
            <Switch
              checked={row.original.is_published}
              onCheckedChange={() => onPublish(row.original)}
              aria-label={t('columns.published')}
            />
          </PermissionGuard>
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PermissionGuard permission={PERMISSIONS.CLASSIFIED.DELETE}>
            <div className='flex justify-end'>
              <Button
                variant='ghost'
                size='icon'
                aria-label={t('actions.delete')}
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          </PermissionGuard>
        ),
      },
    ],
    [onPublish, onDelete, t]
  )
}
