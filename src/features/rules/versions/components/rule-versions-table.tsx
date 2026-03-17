import { useState } from 'react'
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableFacetedFilter } from '@/components/data-table'
import { versionStatuses } from '../data/data'
import { type RuleVersion } from '../data/schema'
import { getRuleVersionColumns } from './rule-versions-columns'

type RuleVersionsTableProps = {
  data: RuleVersion[]
  onEdit: (row: RuleVersion) => void
  onDelete: (row: RuleVersion) => void
  onStatusChange: (row: RuleVersion, newStatus: string) => void
  onCreateNew?: () => void
}

export function RuleVersionsTable({
  data,
  onEdit,
  onDelete,
  onStatusChange,
  onCreateNew,
}: RuleVersionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = getRuleVersionColumns({ onEdit, onDelete, onStatusChange })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='搜索规则编号、版本名称或描述...'
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className='pl-9'
          />
        </div>
        {table.getColumn('versionStatus') && (
          <DataTableFacetedFilter
            column={table.getColumn('versionStatus')}
            title='版本状态'
            options={versionStatuses}
          />
        )}
        <Button onClick={onCreateNew} className='shrink-0'>
          <Plus className='mr-2 size-4' />
          创建新规则
        </Button>
      </div>

      <div className='overflow-hidden rounded-lg border bg-card'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='transition-colors hover:bg-muted/50'
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
                  className='h-32 text-center'
                >
                  <div className='flex flex-col items-center justify-center gap-2 text-muted-foreground'>
                    <Search className='size-8 opacity-40' />
                    <p className='text-sm'>暂无数据</p>
                  </div>
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
