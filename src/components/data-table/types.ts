import type { ComponentType, ReactNode } from 'react'
import type { ColumnDef, Table as ReactTable, VisibilityState } from '@tanstack/react-table'
import type { MetaInterface } from '@/shared/types'
import type { NavigateFn } from '@/hooks/use-table-url-state'

export interface ToolbarFilterOption {
  label: string
  value: string
  icon?: ComponentType<{ className?: string }>
}

export interface ToolbarFilter {
  columnId: string
  title: string
  mode?: 'single' | 'multi'
  options: ToolbarFilterOption[]
}

export interface SortableReorderItem {
  id: number
  sort_order: number
}

export interface EntityRow {
  id: number
}

interface EntityDataTableBaseProps<TData extends EntityRow> {
  data: TData[]
  meta?: MetaInterface
  search: Record<string, unknown>
  navigate: NavigateFn
  columns: ColumnDef<TData>[]
  searchPlaceholder: string
  noResultsMessage: string
  enableRowSelection?: boolean
  enableStatusFilter?: boolean
  defaultSort?: string
  defaultOrder?: 'asc' | 'desc'
  toolbarFilters?: ToolbarFilter[]
  urlColumnFilters?: Array<{
    columnId: string
    searchKey: string
    type?: 'string' | 'array'
  }>
  defaultColumnVisibility?: VisibilityState
  BulkActions?: (props: { table: ReactTable<TData> }) => ReactNode
}

type EntityDataTableReorderDisabled = {
  enableRowReorder?: false
  isReordering?: never
  onReorder?: never
}

type EntityDataTableReorderEnabled = {
  enableRowReorder: true
  isReordering?: boolean
  onReorder: (items: SortableReorderItem[]) => void | Promise<void>
}

export type EntityDataTableProps<TData extends EntityRow> =
  EntityDataTableBaseProps<TData> &
    (EntityDataTableReorderDisabled | EntityDataTableReorderEnabled)

export type ReorderStatus = 'idle' | 'optimistically-reordered' | 'persisting'

export interface ReorderState<TData extends EntityRow> {
  status: ReorderStatus
  rows: TData[]
}
