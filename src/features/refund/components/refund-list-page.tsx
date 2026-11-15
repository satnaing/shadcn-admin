import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import type { RefundKind } from '../data/refund.type'
import { RefundTable } from './refund-table'
import { RefundTabs } from './refund-tabs'

interface Props {
  kind: RefundKind
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Refund requests (`kind="refund"`) and customer disputes of rejected requests (`kind="dispute"`). */
export function RefundListPage({ kind, search, navigate }: Props) {
  const { t } = useTranslation('refund')

  return (
    <AdminPageShell title={t(`${kind}.title`)} description={t(`${kind}.description`)}>
      <RefundTabs search={search} navigate={navigate} />
      <RefundTable kind={kind} search={search} navigate={navigate} />
    </AdminPageShell>
  )
}
