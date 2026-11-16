import { useCallback, useMemo, useState } from 'react'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import type { OrderListItem } from '../data/preorder.type'
import { useOrders } from '../hooks/use-preorder'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { makeOrdersBulkActions } from './preorder-orders-bulk-actions'
import { usePreorderOrderColumns } from './preorder-orders-columns'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function PreorderOrdersTable({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')
  const [removing, setRemoving] = useState<OrderListItem | null>(null)
  const { removeOrder, invoice } = usePreorderMutations()
  const onInvoice = useCallback(
    (o: OrderListItem) => invoice.mutate(o.id),
    [invoice]
  )
  const columns = usePreorderOrderColumns(onInvoice, setRemoving)
  const scope = typeof search.scope === 'string' ? search.scope : undefined
  const BulkActions = useMemo(() => makeOrdersBulkActions(scope), [scope])
  const { data } = useOrders(
    toServerListParams(search, {
      filters: ['scope', 'stage', 'from', 'to'],
      defaultSort: 'created_at',
    })
  )

  return (
    <>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('orders.search')}
        noResultsMessage={t('orders.empty')}
        enableStatusFilter={false}
        defaultSort='created_at'
        BulkActions={BulkActions}
      />
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('orders.deleteTitle')}
        desc={t('orders.deleteDesc', { name: removing?.code })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removeOrder.isPending}
        handleConfirm={() =>
          removing &&
          removeOrder.mutate(removing.id, {
            onSettled: () => setRemoving(null),
          })
        }
      />
    </>
  )
}
