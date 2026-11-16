import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { MessageSquareReply } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import type { QueryItem } from '../data/preorder.type'
import { useQueries } from '../hooks/use-preorder'
import { PreorderQueryDialog } from './preorder-query-dialog'
import { PreorderTabs } from './preorder-tabs'

const h = (key: string) =>
  translatedColumnHeader<QueryItem, unknown>(`preorder:queries.columns.${key}`)
const STATES = ['all', 'pending', 'replied'] as const

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Product questions from customers; answering stores a public reply. */
export function PreorderQueriesPage({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')
  const [openId, setOpenId] = useState<number | null>(null)
  const { data } = useQueries(
    toServerListParams(search, { filters: ['state'] })
  )
  const onOpen = useCallback((q: QueryItem) => setOpenId(q.id), [])
  const columns = useMemo<ColumnDef<QueryItem>[]>(
    () => [
      { accessorKey: 'product_name', ...h('product') },
      { accessorKey: 'customer_name', ...h('customer') },
      {
        accessorKey: 'question',
        ...h('question'),
        cell: ({ row }) => (
          <span className='line-clamp-2 max-w-72'>{row.original.question}</span>
        ),
      },
      {
        accessorKey: 'reply',
        ...h('status'),
        cell: ({ row }) => (
          <Badge variant={row.original.reply ? 'default' : 'outline'}>
            {t(row.original.reply ? 'queries.replied' : 'queries.pending')}
          </Badge>
        ),
      },
      {
        accessorKey: 'created_at',
        ...h('date'),
        cell: ({ row }) => row.original.created_at.slice(0, 10),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PermissionGuard permission={PERMISSIONS.PREORDER.QUERIES_MANAGE}>
            <div className='flex justify-end'>
              <Button
                variant='ghost'
                size='icon'
                aria-label={t('queries.reply')}
                onClick={() => onOpen(row.original)}
              >
                <MessageSquareReply className='size-4' />
              </Button>
            </div>
          </PermissionGuard>
        ),
      },
    ],
    [onOpen, t]
  )

  return (
    <AdminPageShell
      title={t('queries.title')}
      description={t('queries.description')}
    >
      <PreorderTabs
        param='state'
        items={STATES}
        labelKey='queries.state'
        search={search}
        navigate={navigate}
      />
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('queries.search')}
        noResultsMessage={t('queries.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
      />
      <PreorderQueryDialog
        item={data?.data.find((q) => q.id === openId) ?? null}
        onClose={() => setOpenId(null)}
      />
    </AdminPageShell>
  )
}
