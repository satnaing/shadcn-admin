import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { REASON_KINDS, type ReasonItem } from '../data/refund.type'
import { useRefundReasons } from '../hooks/use-refund'
import { useRefundMutations } from '../hooks/use-refund-mutations'
import { RefundReasonDialog } from './refund-reason-dialog'
import { useRefundReasonColumns } from './refund-reasons-columns'
import { RefundReasonsBulkActions } from './refund-reasons-bulk-actions'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function RefundReasonsTable({ search, navigate }: Props) {
  const { t } = useTranslation('refund')
  const [editing, setEditing] = useState<ReasonItem | null>(null)
  const [removing, setRemoving] = useState<ReasonItem | null>(null)
  const { setReasonsActive, removeReason } = useRefundMutations()
  const onToggle = useCallback(
    (r: ReasonItem) => setReasonsActive.mutate({ ids: [r.id], active: !r.is_active }),
    [setReasonsActive]
  )
  const columns = useRefundReasonColumns(onToggle, setEditing, setRemoving)
  const { data } = useRefundReasons(toServerListParams(search, { filters: ['kind'] }))

  const toolbarFilters = useMemo(
    () => [
      {
        columnId: 'kind',
        title: t('reasons.columns.kind'),
        mode: 'single' as const,
        options: REASON_KINDS.map((k) => ({ label: t(`kind.${k}`), value: k })),
      },
    ],
    [t]
  )

  return (
    <>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('reasons.search')}
        noResultsMessage={t('reasons.empty')}
        enableStatusFilter={false}
        toolbarFilters={toolbarFilters}
        urlColumnFilters={[{ columnId: 'kind', searchKey: 'kind', type: 'string' }]}
        BulkActions={RefundReasonsBulkActions}
      />
      {editing && (
        <RefundReasonDialog key={editing.id} open onOpenChange={(open) => !open && setEditing(null)} reason={editing} />
      )}
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('reasons.deleteTitle')}
        desc={t('reasons.deleteDesc', { name: removing?.reason })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removeReason.isPending}
        handleConfirm={() => removing && removeReason.mutate(removing.id, { onSettled: () => setRemoving(null) })}
      />
    </>
  )
}
