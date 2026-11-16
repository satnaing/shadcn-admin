import type { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useTranslation } from 'react-i18next'
import type { ListItemMap } from '@/api/modules/affiliate.api'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import type { AffiliateListKind } from '../data/affiliate.type'
import { useAffiliateList } from '../hooks/use-affiliate'
import { AffiliateTabs } from './affiliate-tabs'

interface Props<K extends AffiliateListKind> {
  kind: K
  columns: ColumnDef<ListItemMap[K]>[]
  tabs?: ReadonlyArray<{ value: string; label: string }>
  defaultSort: string
  search: Record<string, unknown>
  navigate: NavigateFn
  /** Dialogs owned by the page, rendered next to the table. */
  children?: ReactNode
}

/** Title + optional tab bar + server-side table shared by the four list screens (`<kind>.title|description|search|empty`). */
export function AffiliateList<K extends AffiliateListKind>({
  kind,
  columns,
  tabs,
  defaultSort,
  search,
  navigate,
  children,
}: Props<K>) {
  const { t } = useTranslation('affiliate')
  const params = toServerListParams(search, { filters: ['tab'], defaultSort })
  const { data } = useAffiliateList(kind, params)

  return (
    <AdminPageShell
      title={t(`${kind}.title`)}
      description={t(`${kind}.description`)}
    >
      {tabs && (
        <AffiliateTabs tabs={tabs} search={search} navigate={navigate} />
      )}
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns as ColumnDef<ListItemMap[AffiliateListKind]>[]}
        searchPlaceholder={t(`${kind}.search`)}
        noResultsMessage={t(`${kind}.empty`)}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort={defaultSort}
      />
      {children}
    </AdminPageShell>
  )
}
