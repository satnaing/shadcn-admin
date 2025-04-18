import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { AccountGroup, accountGroupFieldMap, AccountGroupStatus } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

// 状态标签映射
const statusMap: Record<AccountGroupStatus, { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }> = {
  active: {
    label: '活跃',
    variant: 'default',
  },
  inactive: {
    label: '禁用',
    variant: 'destructive',
  },
}

// 权限级别映射
const permissionLevelMap = {
  admin: '管理员',
  moderator: '协管员',
  user: '普通用户',
  guest: '访客',
}

// 表格列定义
export const columns: ColumnDef<AccountGroup>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.name} />,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.description} />,
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.getValue('description')}
      </div>
    ),
  },

  {
    accessorKey: 'accountCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.accountCount} />,
    cell: ({ row }) => <div className="text-center">{row.getValue('accountCount')}</div>,
  },
  {
    accessorKey: 'region',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.region} />,
    cell: ({ row }) => <div className="text-center">{row.getValue('region')}</div>,
  },
  {
    accessorKey: 'totalFollowing',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.totalFollowing} />,
    cell: ({ row }) => <div className="text-center">{row.getValue('totalFollowing')}</div>,
  },
  {
    accessorKey: 'totalFollowers',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.totalFollowers} />,
    cell: ({ row }) => <div className="text-center">{row.getValue('totalFollowers')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.status} />,
    cell: ({ row }) => {
      const status = row.getValue('status') as AccountGroupStatus || 'active'
      const statusInfo = statusMap[status]
      
      return (
        <Badge variant={statusInfo?.variant}>
          {statusInfo?.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'permissionLevel',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.permissionLevel} />,
    cell: ({ row }) => {
      const permissionLevel = row.getValue('permissionLevel') as string
      return permissionLevelMap[permissionLevel as keyof typeof permissionLevelMap] || permissionLevel
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.createdAt} />,
    cell: ({ row }) => format(row.getValue('createdAt'), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={accountGroupFieldMap.updatedAt} />,
    cell: ({ row }) => format(row.getValue('updatedAt'), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 