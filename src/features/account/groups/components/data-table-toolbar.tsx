import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { AccountGroup, AccountGroupRegions } from '../data/schema'

// 状态筛选选项
const statuses = [
  {
    value: 'active',
    label: '活跃',
  },
  {
    value: 'inactive',
    label: '禁用',
  },
]

// 权限级别筛选选项
const permissionLevels = [
  {
    value: 'admin',
    label: '管理员',
  },
  {
    value: 'moderator',
    label: '协管员',
  },
  {
    value: 'user',
    label: '普通用户',
  },
  {
    value: 'guest',
    label: '访客',
  },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData extends AccountGroup>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="搜索名称..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* 状态筛选器 */}
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="状态"
            options={statuses}
          />
        )}
        {/* 权限级别筛选器 */}
        {table.getColumn('permissionLevel') && (
          <DataTableFacetedFilter
            column={table.getColumn('permissionLevel')}
            title="权限级别"
            options={permissionLevels}
          />
        )}
        {/* 地区筛选器 */}  
        {table.getColumn('region') && (
          <DataTableFacetedFilter
            column={table.getColumn('region')}
            title="地区"
            options={Object.entries(AccountGroupRegions.shape).map(([key, value]) => ({
              value: key,
              label: value.value,
            }))}
          />
        )}
        
        {/* 清除筛选条件按钮 */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            重置
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* 列显示选项 */}
      <DataTableViewOptions table={table} />
    </div>
  )
} 