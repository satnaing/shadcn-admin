import type { ColumnDef } from '@tanstack/react-table'
import {
  getStatusToolbarFilter,
  STATUS_FILTER_COLUMN_ID,
} from '@/shared/filters/status-filter'
import { DRAG_COLUMN_ID, DRAG_COLUMN_SIZE } from './constants'
import type { EntityRow, SortableReorderItem, ToolbarFilter } from './types'

export function createDragColumn<TData>(): ColumnDef<TData> {
  return {
    id: DRAG_COLUMN_ID,
    header: () => null,
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
    size: DRAG_COLUMN_SIZE,
  }
}

export function hasStatusColumn<TData>(
  columns: ColumnDef<TData>[]
): boolean {
  // Only the column id counts. A visible column may carry
  // accessorKey:'status_label' while its id is 'status'; that one renders the
  // badge but cannot answer table.getColumn(STATUS_FILTER_COLUMN_ID), so the
  // hidden filter column still has to be appended.
  return columns.some((column) => column.id === STATUS_FILTER_COLUMN_ID)
}

export function buildTableColumns<TData>(
  columns: ColumnDef<TData>[],
  options: {
    enableRowReorder: boolean
    enableStatusFilter: boolean
  }
): ColumnDef<TData>[] {
  let nextColumns = columns

  if (options.enableRowReorder) {
    nextColumns = [createDragColumn<TData>(), ...nextColumns]
  }

  if (!options.enableStatusFilter || hasStatusColumn(nextColumns)) {
    return nextColumns
  }

  return [
    ...nextColumns,
    {
      id: STATUS_FILTER_COLUMN_ID,
      accessorKey: 'status',
      enableHiding: true,
      enableSorting: false,
    },
  ]
}

export function resolveToolbarFilters(
  toolbarFilters: ToolbarFilter[] | undefined,
  enableStatusFilter: boolean,
  translate: (key: string) => string
): ToolbarFilter[] {
  const filters = toolbarFilters ?? []

  if (!enableStatusFilter) {
    return filters
  }

  return [getStatusToolbarFilter(translate), ...filters]
}

export function buildReorderPayload<TData extends EntityRow>(
  rows: TData[],
  pageOffset: number
): SortableReorderItem[] {
  return rows.map((row, index) => ({
    id: row.id,
    sort_order: pageOffset + index,
  }))
}

export function findRowIndexById<TData extends EntityRow>(
  rows: TData[],
  rowId: string | number
): number {
  return rows.findIndex((row) => String(row.id) === String(rowId))
}
