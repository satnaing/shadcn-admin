import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { accountFieldMap, AccountStatus } from '../data/schema'
import { DataTableToolbarProps } from '@/components/data-table'
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter'
import { DataTableGroupFilter } from './data-table-group-filter'

// 表格工具栏组件实现
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const selectedAccounts = table.getFilteredSelectedRowModel().flatRows.map((row) => row.original)

  return (
    <div className='flex items-end-safe justify-between'>
      <div className='flex flex-1 flex-wrap items-center space-x-2 gap-2'>
        <Input
          placeholder='搜索用户名...'
          value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
          onChange={(e) => table.getColumn('username')?.setFilterValue(e.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <DataTableFacetedFilter
          column={table.getColumn('status')}
          title={accountFieldMap.status}
          options={Object.entries(AccountStatus.shape).map(([key, value]) => ({
            value: key,
            label: value.value
          }))}
        />
        <DataTableGroupFilter
          column={table.getColumn('group')}
          title='分组'
        />
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
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          disabled={selectedAccounts.length === 0}
          onClick={() => {
            console.log(selectedAccounts)
          }}
          className='h-8'
        >
          删除 ({selectedAccounts.length})
        </Button>
        <DataTableViewOptions table={table} />
      </div>

    </div>
  )
} 