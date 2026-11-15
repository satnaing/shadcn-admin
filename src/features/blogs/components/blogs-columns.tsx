import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import { PERMISSIONS } from '@/shared/permissions'
import type { BlogListItem, BlogStatus } from '../data/blogs.type'

const STATUS_VARIANT: Record<BlogStatus, 'default' | 'secondary' | 'outline'> = {
  published: 'default',
  scheduled: 'outline',
  draft: 'secondary',
}

export function useBlogColumns(onDelete: (blog: BlogListItem) => void): ColumnDef<BlogListItem>[] {
  const { t } = useTranslation('blogs')

  return useMemo(
    () => [
      {
        accessorKey: 'title',
        ...translatedColumnHeader<BlogListItem, unknown>('blogs:columns.title'),
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {row.original.cover ? (
              <img
                src={row.original.cover}
                alt=''
                loading='lazy'
                width={56}
                height={40}
                className='h-10 w-14 rounded border object-cover'
              />
            ) : (
              <div className='h-10 w-14 rounded border bg-muted' />
            )}
            <div className='min-w-0'>
              <div className='truncate font-medium'>{row.original.title}</div>
              <div className='truncate text-xs text-muted-foreground'>/{row.original.slug}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'category_name',
        accessorKey: 'category_name',
        enableSorting: false,
        ...translatedColumnHeader<BlogListItem, unknown>('blogs:columns.category'),
        cell: ({ row }) => <Badge variant='outline'>{row.original.category_name}</Badge>,
      },
      {
        id: 'locales',
        enableSorting: false,
        ...translatedColumnHeader<BlogListItem, unknown>('blogs:columns.languages'),
        cell: ({ row }) => (
          <div className='flex gap-1'>
            {row.original.locales.map((l) => (
              <Badge key={l} variant='secondary' className='uppercase'>
                {l}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        enableSorting: false,
        ...translatedColumnHeader<BlogListItem, unknown>('blogs:columns.status'),
        cell: ({ row }) => (
          <Badge variant={STATUS_VARIANT[row.original.status]}>
            {t(`status.${row.original.status}`)}
          </Badge>
        ),
      },
      {
        accessorKey: 'views',
        ...translatedColumnHeader<BlogListItem, unknown>('blogs:columns.views'),
      },
      {
        accessorKey: 'updated_at',
        ...translatedColumnHeader<BlogListItem, unknown>('blogs:columns.updated'),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end gap-1'>
            <PermissionGuard permission={PERMISSIONS.BLOGS.UPDATE}>
              <Button asChild variant='ghost' size='icon' aria-label={t('actions.edit')}>
                <Link to='/admin/blogs/$id' params={{ id: String(row.original.id) }}>
                  <Pencil className='size-4' />
                </Link>
              </Button>
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.BLOGS.DELETE}>
              <Button
                variant='ghost'
                size='icon'
                className='text-destructive'
                aria-label={t('actions.delete')}
                onClick={() => onDelete(row.original)}
              >
                <Trash2 className='size-4' />
              </Button>
            </PermissionGuard>
          </div>
        ),
      },
    ],
    [t, onDelete]
  )
}
