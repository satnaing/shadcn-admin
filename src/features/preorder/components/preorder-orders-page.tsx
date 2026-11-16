import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ORDER_SCOPES, ORDER_STATUSES } from '../data/preorder.type'
import { useOrderCounts } from '../hooks/use-preorder'
import { PreorderDateRange } from './preorder-date-range'
import { PreorderOrdersTable } from './preorder-orders-table'
import { PreorderTabs } from './preorder-tabs'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Orders list: scope tabs (all / in-house / seller / delayed lists) + workflow-stage tabs with counts + date range. */
export function PreorderOrdersPage({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')
  const scope = typeof search.scope === 'string' ? search.scope : undefined
  const { data } = useOrderCounts(scope)

  return (
    <AdminPageShell
      title={t('orders.title')}
      description={t('orders.description')}
    >
      <PreorderTabs
        param='scope'
        items={ORDER_SCOPES}
        labelKey='scope'
        search={search}
        navigate={navigate}
      />
      <PreorderTabs
        param='stage'
        items={ORDER_STATUSES}
        labelKey='stage'
        search={search}
        navigate={navigate}
        counts={data?.data}
      />
      <PreorderDateRange search={search} navigate={navigate} />
      <PreorderOrdersTable search={search} navigate={navigate} />
    </AdminPageShell>
  )
}
