import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { keyBy } from 'lodash'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { executionsColumns as columns } from '../data/executions-columns'
import { type Execution } from '../data/schema'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { useExecutions } from './executions-provider'

const route = getRouteApi('/activity/')

type DataTableProps = {
  data: Execution[]
  playbooks?: Array<{ id: string; name: string }>
  scenarios?: Array<{ id: string; name: string; playbookId: string }>
  totalCount?: number
  isLoading?: boolean
}

export function ExecutionsTable({
  data,
  playbooks = [],
  scenarios = [],
  totalCount = 0,
  isLoading = false,
}: DataTableProps) {
  const { setOpen, setCurrentExecution } = useExecutions()

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true }, // Default sort by creation date descending
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Synced with URL states
  const {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 20 },
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: [
      { columnId: 'status', searchKey: 'status', type: 'string' },
      { columnId: 'type', searchKey: 'type', type: 'string' },
      { columnId: 'playbookId', searchKey: 'playbookId', type: 'string' },
      { columnId: 'scenarioId', searchKey: 'scenarioId', type: 'string' },
    ],
  })

  // Create playbook lookup map
  const playbookLookup = keyBy(playbooks, 'id')
  const scenarioLookup = keyBy(scenarios, 'id')

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
    meta: {
      playbooks: playbookLookup,
      scenarios: scenarioLookup,
    },
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    manualPagination: true,
    manualFiltering: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange,
    onGlobalFilterChange,
    onColumnFiltersChange,
  })

  const pageCount = table.getPageCount()
  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar table={table} playbooks={playbooks} scenarios={scenarios} />
      <div className='relative overflow-hidden rounded-md border'>
        {isLoading && (
          <div className='bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm'>
            <div className='flex flex-col items-center gap-2'>
              <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
              <p className='text-muted-foreground text-sm'>Loading activity...</p>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className='hover:bg-muted/50 cursor-pointer'
                  onClick={() => {
                    const execution = row.original as Execution
                    setCurrentExecution(execution)
                    setOpen('view')
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      data-column-id={cell.column.id}
                      onClick={
                        cell.column.id === 'actions' ? (e) => e.stopPropagation() : undefined
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
