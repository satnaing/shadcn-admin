import type { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import type { CourierListKind, ListItemMap } from '../data/courier.type'
import { useCourierList } from '../hooks/use-courier'
import { CourierTabs } from './courier-tabs'

interface Props<K extends CourierListKind> {
  kind: K
  columns: ColumnDef<ListItemMap[K]>[]
  tabs?: ReadonlyArray<{ value: string; label: string }>
  defaultSort: string
  search: Record<string, unknown>
  navigate: NavigateFn
  /** Header buttons (e.g. "Add courier"). */
  actions?: ReactNode
  /** Dialogs owned by the page, rendered next to the table. */
  children?: ReactNode
}

/** Title + optional tab bar + server-side table shared by every list screen (`<kind>.title|description|search|empty`). */
export function CourierList<K extends CourierListKind>({
  kind,
  columns,
  tabs,
  defaultSort,
  search,
  navigate,
  actions,
  children,
}: Props<K>) {
  const { t } = useTranslation('courier')
  const params = toServerListParams(search, { filters: ['tab'], defaultSort })
  const { data } = useCourierList(kind, params)

  return (
    <AdminPageShell
      title={t(`${kind}.title`)}
      description={t(`${kind}.description`)}
      actions={actions}
    >
      {tabs && <CourierTabs tabs={tabs} search={search} navigate={navigate} />}
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns as ColumnDef<ListItemMap[CourierListKind]>[]}
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
