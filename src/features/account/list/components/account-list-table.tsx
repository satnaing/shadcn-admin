import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useCallback, useEffect, useState } from 'react'
import { accountService } from '@/services/account-services'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { columns } from './account-list-columns'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { Account } from '../data/schema'
import { useAccountListContext } from '../context/account-list-context'

// 账号表格组件实现
export function AccountListTable() {
  // 表格状态
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Account[]>([])
  const [accountGroups, setAccountGroups] = useState<{ id: number, name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // 上下文
  const { selectedAccounts, setSelectedAccounts, refreshTrigger } = useAccountListContext()

  // 获取账号列表数据
  const fetchAccounts = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await accountService.getAccounts()
      setData(response.content || [])
    } catch (error) {
      console.error('获取账号列表失败', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 获取账号分组数据
  const fetchAccountGroups = useCallback(async () => {
    try {
      const response = await accountService.getAccountGroups()
      setAccountGroups(response.content || [])
    } catch (error) {
      console.error('获取账号分组失败', error)
    }
  }, [])

  // 初始化加载数据
  useEffect(() => {
    fetchAccounts()
    fetchAccountGroups()
  }, [fetchAccounts, fetchAccountGroups, refreshTrigger])

  // 创建表格
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // 更新选中行
  useEffect(() => {
    const selectedRows = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original as Account)
    setSelectedAccounts(selectedRows)
  }, [rowSelection, table, setSelectedAccounts])

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} accountGroups={accountGroups} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='whitespace-nowrap'>
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  加载中...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                  没有找到任何账号
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