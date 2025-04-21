import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

// 表格工具栏组件Props
interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

// 表格工具栏组件实现
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex flex-wrap items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='搜索账号...'
          value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn('username')?.setFilterValue(e.target.value)}
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
        {/* {table.getColumn('group') && (
          <DataTableFacetedFilter
            column={table.getColumn('group')}
            title='分组'
            options={[]}
          />
        )} */}
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
      {/* <div className='flex items-center space-x-2'>
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
        
      </div> */}
      <DataTableViewOptions table={table} />
    </div>
  )
} 