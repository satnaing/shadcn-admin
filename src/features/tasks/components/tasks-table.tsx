import { useEffect, useMemo, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  type OnChangeFn,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Task } from '../data/schema'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { tasksColumns as columns } from './tasks-columns'

const route = getRouteApi('/_authenticated/tasks/')

type DataTableProps = {
  data: Task[]
}

export function TasksTable({ data }: DataTableProps) {
  const navigate = route.useNavigate()
  const {
    page = 1,
    pageSize = 10,
    status = [],
    priority = [],
    filter = '',
  } = route.useSearch()

  const initColFilters: ColumnFiltersState = [
    ...(status.length > 0 ? [{ id: 'status', value: status }] : []),
    ...(priority.length > 0 ? [{ id: 'priority', value: priority }] : []),
  ]

  // Local UI-only states
  const [globalFilter, setGlobalFilter] = useState(filter)
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initColFilters)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Update global filter state and sync with search params
  const onGlobalFilterChange: OnChangeFn<string> = (updater) => {
    const filter =
      typeof updater === 'function' ? updater(globalFilter) : updater
    setGlobalFilter(filter)
    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        filter: filter.trim() !== '' ? filter : undefined,
      }),
    })
  }

  // Update filter state and sync with search params
  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next =
      typeof updater === 'function' ? updater(columnFilters) : updater

    setColumnFilters(next)

    const status = next.flatMap(({ id, value }) =>
      id === 'status' ? value : []
    )
    const priority = next.flatMap(({ id, value }) =>
      id === 'priority' ? value : []
    )

    navigate({
      search: (prev) => ({
        ...prev,
        page: undefined,
        status: status.length > 0 ? status : undefined,
        priority: priority.length > 0 ? priority : undefined,
      }),
    })
  }

  // Derive pagination state from URL search params (single source of truth)
  const pagination: PaginationState = useMemo(
    () => ({ pageIndex: Math.max(0, page - 1), pageSize }),
    [page, pageSize]
  )

  // Update pagination state and sync with search params
  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater

    const nextPage = next.pageIndex + 1
    const nextPageSize = next.pageSize

    navigate({
      search: (prev) => ({
        ...prev,
        page: nextPage <= 1 ? undefined : nextPage,
        pageSize: nextPageSize === 10 ? undefined : nextPageSize,
      }),
    })
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: (row, _columnId, filterValue) => {
      const id = String(row.getValue('id')).toLowerCase()
      const title = String(row.getValue('title')).toLowerCase()
      const searchValue = String(filterValue).toLowerCase()

      return id.includes(searchValue) || title.includes(searchValue)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
  })

  const pageCount = table.getPageCount()

  // Clamp out-of-range pages to the last available page when data shrinks or user enters a large page
  useEffect(() => {
    if (pageCount > 0 && page > pageCount) {
      navigate({
        search: (prev) => ({ ...prev, page: undefined }),
        replace: true,
      })
    }
  }, [page, pageCount, navigate])

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar table={table} />
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      <DataTableBulkActions table={table} />
    </div>
  )
}
