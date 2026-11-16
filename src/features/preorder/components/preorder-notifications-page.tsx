import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import {
  NOTIFICATION_USERS,
  type NotificationTypeItem,
} from '../data/preorder.type'
import { useNotificationTypes } from '../hooks/use-preorder'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { FlagSwitch } from './preorder-flag-switch'
import { PreorderNotificationDialog } from './preorder-notification-dialog'
import { PreorderRowButtons } from './preorder-row-buttons'
import { PreorderTabs } from './preorder-tabs'

const h = (key: string) =>
  translatedColumnHeader<NotificationTypeItem, unknown>(
    `preorder:notifications.columns.${key}`
  )
const MANAGE = PERMISSIONS.PREORDER.NOTIFICATIONS_MANAGE

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Notification templates of the module, per audience; switch a type off to stop sending it. */
export function PreorderNotificationsPage({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')
  const [editing, setEditing] = useState<NotificationTypeItem | null>(null)
  const { setNotificationActive } = usePreorderMutations()
  const userType =
    typeof search.user_type === 'string' ? search.user_type : 'customer'
  const { data } = useNotificationTypes({
    ...toServerListParams(search),
    user_type: userType,
  })
  const onToggle = useCallback(
    (n: NotificationTypeItem, value: boolean) =>
      setNotificationActive.mutate({ id: n.id, value }),
    [setNotificationActive]
  )
  const columns = useMemo<ColumnDef<NotificationTypeItem>[]>(
    () => [
      {
        accessorKey: 'name',
        ...h('name'),
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <img
              src={row.original.image}
              alt=''
              loading='lazy'
              width={32}
              height={32}
              className='size-8 rounded border object-cover'
            />
            <div>
              <div className='font-medium'>{row.original.name}</div>
              <div className='text-xs text-muted-foreground'>
                {row.original.type}
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'default_text',
        enableSorting: false,
        ...h('text'),
        cell: ({ row }) => (
          <span className='line-clamp-2 max-w-md'>
            {row.original.default_text}
          </span>
        ),
      },
      {
        id: 'is_active',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) => (
          <FlagSwitch
            permission={MANAGE}
            checked={row.original.is_active}
            label={t('notifications.columns.status')}
            onChange={(v) => onToggle(row.original, v)}
          />
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PreorderRowButtons
            permission={MANAGE}
            onEdit={() => setEditing(row.original)}
          />
        ),
      },
    ],
    [onToggle, t]
  )

  return (
    <AdminPageShell
      title={t('notifications.title')}
      description={t('notifications.description')}
    >
      <PreorderTabs
        param='user_type'
        items={NOTIFICATION_USERS}
        labelKey='notifications.user'
        search={search}
        navigate={navigate}
      />
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('notifications.search')}
        noResultsMessage={t('notifications.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='id'
        defaultOrder='asc'
      />
      {editing && (
        <PreorderNotificationDialog
          key={editing.id}
          open
          onOpenChange={(open) => !open && setEditing(null)}
          item={editing}
        />
      )}
    </AdminPageShell>
  )
}
