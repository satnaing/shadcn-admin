import type { ColumnDef } from '@tanstack/react-table'
import type { MetaInterface } from '@/shared/types'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { EntityDataTable } from '@/components/data-table/entity-data-table'
import type { EntityRow } from './types'

interface EntityTrashDataTableProps<TData extends EntityRow> {
  data: TData[]
  meta?: MetaInterface
  search: Record<string, unknown>
  navigate: NavigateFn
  columns: ColumnDef<TData>[]
  searchPlaceholder: string
  noResultsMessage: string
}

export function EntityTrashDataTable<TData extends EntityRow>({
  data,
  meta,
  search,
  navigate,
  columns,
  searchPlaceholder,
  noResultsMessage,
}: EntityTrashDataTableProps<TData>) {
  return (
    <EntityDataTable
      data={data}
      meta={meta}
      search={search}
      navigate={navigate}
      columns={columns}
      searchPlaceholder={searchPlaceholder}
      noResultsMessage={noResultsMessage}
      enableRowSelection={false}
    />
  )
}
