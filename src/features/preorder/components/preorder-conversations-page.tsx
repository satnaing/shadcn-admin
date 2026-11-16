import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { Eye, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import type { ConversationItem } from '../data/preorder.type'
import { useConversations } from '../hooks/use-preorder'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderConversationDialog } from './preorder-conversation-dialog'

const h = (key: string) =>
  translatedColumnHeader<ConversationItem, unknown>(
    `preorder:conversations.columns.${key}`
  )

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Customer ↔ product-owner conversations; the admin can read, reply to and delete them. */
export function PreorderConversationsPage({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')
  const [openId, setOpenId] = useState<number | null>(null)
  const [removing, setRemoving] = useState<ConversationItem | null>(null)
  const { removeConversation } = usePreorderMutations()
  const { data } = useConversations(
    toServerListParams(search, { defaultSort: 'last_message_at' })
  )
  const onOpen = useCallback((c: ConversationItem) => setOpenId(c.id), [])
  const columns = useMemo<ColumnDef<ConversationItem>[]>(
    () => [
      { accessorKey: 'title', ...h('title') },
      { accessorKey: 'product_name', ...h('product') },
      { accessorKey: 'sender_name', ...h('sender') },
      { accessorKey: 'receiver_name', ...h('receiver') },
      {
        accessorKey: 'last_message_at',
        ...h('date'),
        cell: ({ row }) => row.original.last_message_at.slice(0, 10),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end gap-1'>
            <Button
              variant='ghost'
              size='icon'
              aria-label={t('actions.view')}
              onClick={() => onOpen(row.original)}
            >
              <Eye className='size-4' />
            </Button>
            <PermissionGuard
              permission={PERMISSIONS.PREORDER.CONVERSATIONS_MANAGE}
            >
              <Button
                variant='ghost'
                size='icon'
                aria-label={t('actions.delete')}
                onClick={() => setRemoving(row.original)}
              >
                <Trash2 className='size-4' />
              </Button>
            </PermissionGuard>
          </div>
        ),
      },
    ],
    [onOpen, t]
  )

  return (
    <AdminPageShell
      title={t('conversations.title')}
      description={t('conversations.description')}
    >
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('conversations.search')}
        noResultsMessage={t('conversations.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='last_message_at'
      />
      <PreorderConversationDialog id={openId} onClose={() => setOpenId(null)} />
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('conversations.deleteTitle')}
        desc={t('conversations.deleteDesc', { name: removing?.title })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removeConversation.isPending}
        handleConfirm={() =>
          removing &&
          removeConversation.mutate(removing.id, {
            onSettled: () => setRemoving(null),
          })
        }
      />
    </AdminPageShell>
  )
}
