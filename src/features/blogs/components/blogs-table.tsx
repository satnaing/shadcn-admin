import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import type { BlogListItem } from '../data/blogs.type'
import { useBlogMutations } from '../hooks/use-blog-mutations'
import { useBlogCategories, useBlogs } from '../hooks/use-blogs'
import { useBlogColumns } from './blogs-columns'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function BlogsTable({ search, navigate }: Props) {
  const { t } = useTranslation('blogs')
  const [target, setTarget] = useState<BlogListItem | null>(null)
  const { remove } = useBlogMutations()
  const onDelete = useCallback((blog: BlogListItem) => setTarget(blog), [])
  const columns = useBlogColumns(onDelete)

  const { data } = useBlogs(toServerListParams(search, { defaultSort: 'updated_at', filters: ['status', 'category'] }))
  const { data: categories } = useBlogCategories({ per_page: 100 })

  const toolbarFilters = useMemo(
    () => [
      {
        columnId: 'status',
        title: t('columns.status'),
        mode: 'single' as const,
        options: (['published', 'scheduled', 'draft'] as const).map((s) => ({
          label: t(`status.${s}`),
          value: s,
        })),
      },
      {
        columnId: 'category_name',
        title: t('columns.category'),
        mode: 'single' as const,
        options: (categories?.data ?? []).map((c) => ({ label: c.name, value: String(c.id) })),
      },
    ],
    [t, categories]
  )

  return (
    <>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('list.search')}
        noResultsMessage={t('list.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='updated_at'
        toolbarFilters={toolbarFilters}
        urlColumnFilters={[
          { columnId: 'status', searchKey: 'status', type: 'string' },
          { columnId: 'category_name', searchKey: 'category', type: 'string' },
        ]}
      />
      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={t('delete.title')}
        desc={t('delete.desc', { title: target?.title })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={remove.isPending}
        handleConfirm={() =>
          target && remove.mutate(target.id, { onSettled: () => setTarget(null) })
        }
      />
    </>
  )
}
