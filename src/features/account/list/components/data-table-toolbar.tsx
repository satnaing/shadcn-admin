import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { useAccountListContext } from '../context/account-list-context'

// 表格工具栏组件Props
interface DataTableToolbarProps<TData> {
  table: Table<TData>
  accountGroups: { id: number, name: string }[]
}

// 表格工具栏组件实现
export function DataTableToolbar<TData>({
  table,
  accountGroups,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { selectedAccounts, setOpen } = useAccountListContext()
  const [searchValue, setSearchValue] = useState('')

  // 全局筛选处理
  useEffect(() => {
    const timer = setTimeout(() => {
      table.setGlobalFilter(searchValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, table])

  // 批量删除处理
  const handleBatchDelete = () => {
    if (selectedAccounts.length > 0) {
      setOpen('delete')
    }
  }

  // 批量修改分组处理
  const handleBatchUpdateGroup = () => {
    if (selectedAccounts.length > 0) {
      setOpen('updateGroup')
    }
  }

  return (
    <div className='flex flex-wrap items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='搜索账号...'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title='状态'
            options={[
              { value: 1, label: '正常' },
              { value: 0, label: '异常' },
            ]}
          />
        )}
        {table.getColumn('group') && accountGroups.length > 0 && (
          <DataTableFacetedFilter
            column={table.getColumn('group')}
            title='分组'
            options={accountGroups.map(group => ({
              value: group.id,
              label: group.name
            }))}
          />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            重置
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        {selectedAccounts.length > 0 && (
          <>
            <Button 
              variant='outline' 
              size='sm'
              onClick={handleBatchUpdateGroup}
              className='h-8'
            >
              修改分组 ({selectedAccounts.length})
            </Button>
            <Button 
              variant='outline' 
              size='sm'
              onClick={handleBatchDelete}
              className='h-8'
            >
              删除 ({selectedAccounts.length})
            </Button>
          </>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
} 