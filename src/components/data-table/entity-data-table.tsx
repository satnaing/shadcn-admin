import { closestCenter, DndContext } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Table } from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { DataTableErrorBoundary } from './entity-table-error-boundary'
import { EntityTableBody } from './entity-table-body'
import { EntityTableHeader } from './entity-table-header'
import {
  useEntityReactTable,
  useEntityTableUrlState,
} from '@/components/data-table/hooks'
import { useTableRowReorder } from './hooks/use-table-row-reorder'
import type { EntityDataTableProps, EntityRow } from './types'

export type { EntityDataTableProps, SortableReorderItem } from './types'

export function EntityDataTable<TData extends EntityRow>({
  data,
  meta,
  search,
  navigate,
  columns,
  searchPlaceholder,
  noResultsMessage,
  enableRowSelection = true,
  enableStatusFilter = true,
  enableRowReorder = false,
  isReordering = false,
  defaultSort = 'id',
  defaultOrder = 'desc',
  onReorder,
  toolbarFilters,
  urlColumnFilters,
  defaultColumnVisibility,
  BulkActions,
}: EntityDataTableProps<TData>) {
  const { t } = useTranslation('common')

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    ensurePageInRange,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    resolvedToolbarFilters,
    pageCount,
    rowCount,
    pageIndex,
    pageSize,
  } = useEntityTableUrlState({
    meta,
    search,
    navigate,
    enableStatusFilter,
    defaultSort,
    defaultOrder,
    toolbarFilters,
    urlColumnFilters,
    defaultColumnVisibility,
  })

  const { rows, sensors, handleDragEnd } = useTableRowReorder({
    data,
    enabled: enableRowReorder,
    isPersisting: isReordering,
    pageIndex,
    pageSize,
    onReorder,
  })

  const displayData = enableRowReorder ? rows : data

  const { table, tableColumns } = useEntityReactTable({
    data: displayData,
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
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    ensurePageInRange,
  })

  const tableRows = table.getRowModel().rows

  const tableMarkup = (
    <Table>
      <EntityTableHeader headerGroups={table.getHeaderGroups()} />
      <EntityTableBody
        rows={tableRows}
        columnCount={tableColumns.length}
        noResultsMessage={noResultsMessage}
        enableRowReorder={enableRowReorder}
        isReordering={isReordering}
      />
    </Table>
  )

  return (
    <DataTableErrorBoundary fallbackMessage={t('table.renderError')}>
      <div
        className={cn(
          'max-sm:has-[div[role="toolbar"]]:mb-16',
          'flex flex-1 flex-col gap-4'
        )}
        aria-busy={isReordering || undefined}
      >
        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          filters={resolvedToolbarFilters}
        />
        <div className='overflow-hidden rounded-md border'>
          {enableRowReorder ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {tableMarkup}
            </DndContext>
          ) : (
            tableMarkup
          )}
        </div>
        <DataTablePagination table={table} className='mt-auto' />
        {BulkActions ? <BulkActions table={table} /> : null}
      </div>
    </DataTableErrorBoundary>
  )
}
