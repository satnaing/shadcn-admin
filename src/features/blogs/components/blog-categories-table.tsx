import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { PERMISSIONS } from '@/shared/permissions'
import type { BlogCategoryListItem } from '../data/blogs.type'
import { useBlogMutations } from '../hooks/use-blog-mutations'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useBlogCategories } from '../hooks/use-blogs'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
  onEdit: (id: number) => void
}

export function BlogCategoriesTable({ search, navigate, onEdit }: Props) {
  const { t } = useTranslation('blogs')
  const { removeCategory } = useBlogMutations()
  const [target, setTarget] = useState<BlogCategoryListItem | null>(null)
  const onDelete = useCallback((c: BlogCategoryListItem) => setTarget(c), [])

  const { data } = useBlogCategories(toServerListParams(search, { defaultSort: 'id', defaultOrder: 'asc' }))

  const columns = useMemo<ColumnDef<BlogCategoryListItem>[]>(
    () => [
      { accessorKey: 'name', ...translatedColumnHeader<BlogCategoryListItem, unknown>('blogs:categories.name') },
      { accessorKey: 'slug', enableSorting: false, ...translatedColumnHeader<BlogCategoryListItem, unknown>('blogs:form.slug') },
      { accessorKey: 'posts_count', enableSorting: false, ...translatedColumnHeader<BlogCategoryListItem, unknown>('blogs:categories.posts') },
      {
        id: 'status',
        accessorKey: 'status',
        enableSorting: false,
        ...translatedColumnHeader<BlogCategoryListItem, unknown>('blogs:columns.status'),
        cell: ({ row }) => (
          <Badge variant={row.original.status ? 'default' : 'secondary'}>
            {t(row.original.status ? 'categories.active' : 'categories.inactive')}
          </Badge>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        enableSorting: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end gap-1'>
            <PermissionGuard permission={PERMISSIONS.BLOGS.CATEGORIES}>
              <Button variant='ghost' size='icon' aria-label={t('actions.edit')} onClick={() => onEdit(row.original.id)}>
                <Pencil className='size-4' />
              </Button>
              <Button variant='ghost' size='icon' className='text-destructive' aria-label={t('actions.delete')} onClick={() => onDelete(row.original)}>
                <Trash2 className='size-4' />
              </Button>
            </PermissionGuard>
          </div>
        ),
      },
    ],
    [t, onEdit, onDelete]
  )

  return (
    <>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('categories.search')}
        noResultsMessage={t('categories.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='id'
        defaultOrder='asc'
      />
      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={t('categories.deleteTitle')}
        desc={t('categories.deleteDesc', { name: target?.name })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removeCategory.isPending}
        handleConfirm={() =>
          target && removeCategory.mutate(target.id, { onSettled: () => setTarget(null) })
        }
      />
    </>
  )
}
