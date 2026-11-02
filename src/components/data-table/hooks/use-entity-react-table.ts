import { useEffect, useMemo } from 'react'
import {
  type ColumnDef,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type OnChangeFn,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Table as ReactTable,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import type { EntityRow } from '../types'
import { buildTableColumns } from '../utils'

interface UseEntityReactTableParams<TData extends EntityRow> {
  data: TData[]
  columns: ColumnDef<TData>[]
  enableRowSelection: boolean
  enableStatusFilter: boolean
  enableRowReorder: boolean
  pageCount: number
  rowCount: number
  sorting: SortingState
  pagination: PaginationState
  rowSelection: RowSelectionState
  columnFilters: ColumnFiltersState
  columnVisibility: VisibilityState
  onPaginationChange: OnChangeFn<PaginationState>
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  onRowSelectionChange: OnChangeFn<RowSelectionState>
  onSortingChange: OnChangeFn<SortingState>
  onColumnVisibilityChange: OnChangeFn<VisibilityState>
  ensurePageInRange: (pageCount: number) => void
}

interface UseEntityReactTableResult<TData extends EntityRow> {
  table: ReactTable<TData>
  tableColumns: ColumnDef<TData>[]
}

export function useEntityReactTable<TData extends EntityRow>({
  data,
  columns,
  enableRowSelection,
  enableStatusFilter,
  enableRowReorder,
  pageCount,
  rowCount,
  sorting,
  pagination,
  rowSelection,
  columnFilters,
  columnVisibility,
  onPaginationChange,
  onColumnFiltersChange,
  onRowSelectionChange,
  onSortingChange,
  onColumnVisibilityChange,
  ensurePageInRange,
}: UseEntityReactTableParams<TData>): UseEntityReactTableResult<TData> {
  const tableColumns = useMemo(
    () =>
      buildTableColumns(columns, {
        enableRowReorder,
        enableStatusFilter,
      }),
    [columns, enableRowReorder, enableStatusFilter]
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    getRowId: (row) => String(row.id),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount,
    rowCount,
    autoResetPageIndex: false,
    enableRowSelection,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange,
    onSortingChange,
    onColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  return { table, tableColumns }
}
