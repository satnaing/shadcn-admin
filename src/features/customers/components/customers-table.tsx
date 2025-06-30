import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
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
import { Customer } from '../data/schema'
import { SimpleDataTablePagination } from  './data-table-pagination'
import { DataTableToolbar } from  './data-table-toolbar'

interface DataTableProps {
  columns: ColumnDef<Customer>[]
  data: Customer[]
  pageIndex: number
  setPageIndex: (index: number) => void
  pageSize: number
  setPageSize: (size: number) => void
  isLoading?: boolean
  emptyMessage?: string // Add emptyMessage prop
}

export function CustomersTable({ columns, data, pageIndex, setPageIndex, pageSize, setPageSize, isLoading, emptyMessage }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <div className='rounded-md border'>
      <Table>
        <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className='group/row'>
          {headerGroup.headers.map((header) => {
            return (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className={header.column.columnDef.meta?.className ?? ''}
            >
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
        {isLoading ? (
          <TableRow>
          <TableCell colSpan={columns.length} className='h-24 text-center'>Loading...</TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
            className='group/row'
          >
            {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className={cell.column.columnDef.meta?.className ?? ''}
            >
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
            {emptyMessage || 'No results.'}
          </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
      </div>
      <SimpleDataTablePagination 
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        isLastPage={data.length < pageSize}
      />
    </div>
  )
}
