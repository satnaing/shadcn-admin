import { useEffect, useState, useMemo, useCallback } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { toast } from 'sonner'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loadable } from '@/components/loadable'
import { createOutreachColumns } from '../data/outreach-columns'
import { type CampaignContactTableRow } from '../data/schema'
import {
  useCampaignContactPauseMutation,
  useCampaignContactContinueMutation,
  GetCampaignContactsDocument,
} from '../graphql/operations.generated'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { useOutreach } from './outreach-provider'

const route = getRouteApi('/outreach/')

type DataTableProps = {
  data: CampaignContactTableRow[]
  totalCount?: number
  isLoading?: boolean
}

export function OutreachTable({ data, totalCount = 0, isLoading = false }: DataTableProps) {
  const { setOpen, setCurrentOutreach } = useOutreach()
  const [loadingContactIds, setLoadingContactIds] = useState<Set<string>>(new Set())

  const [pauseMutation] = useCampaignContactPauseMutation({
    onCompleted: () => {
      toast.success('Contact paused successfully')
    },
    onError: (error) => {
      toast.error(`Failed to pause contact: ${error.message}`)
    },
    refetchQueries: [GetCampaignContactsDocument],
  })

  const [continueMutation] = useCampaignContactContinueMutation({
    onCompleted: () => {
      toast.success('Contact continued successfully')
    },
    onError: (error) => {
      toast.error(`Failed to continue contact: ${error.message}`)
    },
    refetchQueries: [GetCampaignContactsDocument],
  })

  const handleTogglePause = useCallback(
    async (contactId: string, isRunning: boolean) => {
      setLoadingContactIds((prev) => new Set(prev).add(contactId))

      try {
        if (isRunning) {
          await pauseMutation({
            variables: { input: { id: contactId, allFromCompany: false } },
          })
        } else {
          await continueMutation({
            variables: { input: { id: contactId, allFromCompany: false } },
          })
        }
      } finally {
        setLoadingContactIds((prev) => {
          const next = new Set(prev)
          next.delete(contactId)
          return next
        })
      }
    },
    [pauseMutation, continueMutation]
  )

  // Local UI-only states
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true }, // Default sort by creation date descending
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const search = route.useSearch()
  const navigate = route.useNavigate()

  const columns = useMemo(
    () =>
      createOutreachColumns({
        onTogglePause: handleTogglePause,
        loadingContactIds,
      }),
    [handleTogglePause, loadingContactIds]
  )

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
      { columnId: 'sender', searchKey: 'senderId', type: 'string' },
    ],
  })

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
      <DataTableToolbar table={table} />
      <div className='relative overflow-hidden rounded-md border'>
        {isLoading && (
          <div className='bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm'>
            <Loadable isLoading={isLoading} />
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
                    const outreach = row.original as CampaignContactTableRow
                    setCurrentOutreach(outreach)
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
