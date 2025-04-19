import { useState } from 'react'
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
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
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { Spinner } from '@/components/ui/spinner'
import { columns } from './account-groups-columns'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getAccountGroups, GROUP_URL } from '@/services/account-groups'

export function AccountGroupsTable() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });


  const { data, isLoading } = useQuery({
    queryKey: [GROUP_URL, pagination, columnFilters, sorting],
    queryFn: () => getAccountGroups(pagination, columnFilters, sorting),
    placeholderData: keepPreviousData,
  })

  const table = useReactTable({
    data: data?.content || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true, // 手动分页
    manualFiltering: true, // 手动筛选
    manualSorting: true, // 手动排序
    pageCount: data?.page.totalPages || 0,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })



  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                  className="h-24 text-center"
                >
                  暂无数据
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