import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EntityDataTable } from '@/components/data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import type { RefundKind, RefundListItem } from '../data/refund.type'
import { useRefundList } from '../hooks/use-refund'
import { useRefundColumns } from './refund-columns'
import { RefundDetailDialog } from './refund-detail-dialog'

interface Props {
  kind: RefundKind
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function RefundTable({ kind, search, navigate }: Props) {
  const { t } = useTranslation('refund')
  const [openId, setOpenId] = useState<number | null>(null)
  const onOpen = useCallback((r: RefundListItem) => setOpenId(r.id), [])
  const columns = useRefundColumns(kind, onOpen)
  const params = toServerListParams(search, { filters: ['tab'], defaultSort: 'requested_at' })
  const { data } = useRefundList(kind, params)

  return (
    <>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t(`${kind}.search`)}
        noResultsMessage={t(`${kind}.empty`)}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='requested_at'
      />
      <RefundDetailDialog id={openId} kind={kind} onClose={() => setOpenId(null)} />
    </>
  )
}
