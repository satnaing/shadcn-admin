import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FollowerCollectTask, followerCollectTaskFieldMap } from '../data/schema'

// 账号列表表格列定义
export const columns: ColumnDef<FollowerCollectTask>[] = [
  // 选择列
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='全选'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='选择行'
      />
    ),
  },
  // ID列
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title={followerCollectTaskFieldMap.id} />,
    cell: ({ row }) => <div>{row.getValue('id')}</div>
  },
  // 任务名称列
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title={followerCollectTaskFieldMap.name} />,
    cell: ({ row }) => <div>{row.getValue('name')}</div>
  },
  // 任务描述列
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title={followerCollectTaskFieldMap.description} />,
    cell: ({ row }) => <div>{row.getValue('description')}</div>
  },
  // 分组列
  {
    accessorKey: 'group',
    header: ({ column }) => <DataTableColumnHeader column={column} title={followerCollectTaskFieldMap.group} />,
    cell: ({ row }) => {
      const group = row.original.group
      return <div>{group ? group.name : '--'}</div>
    },
  },
  // 总粉丝数列
  {
    accessorKey: 'total',
    header: ({ column }) => <DataTableColumnHeader column={column} title={followerCollectTaskFieldMap.total} />,
    cell: ({ row }) => <div>{row.getValue('total')}</div>
  },
  // 已处理粉丝数列
  {
    accessorKey: 'processed',
    header: ({ column }) => <DataTableColumnHeader column={column} title={followerCollectTaskFieldMap.processed} />,
    cell: ({ row }) => <div>{row.getValue('processed')}</div>
  },
  // 任务状态列
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title={followerCollectTaskFieldMap.status} />,
    cell: ({ row }) => <div>{row.getValue('status')}</div>
  },
  // 创建时间列
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={followerCollectTaskFieldMap.createdAt} />,
    cell: ({ row }) => format(row.getValue('createdAt'), 'yyyy-MM-dd HH:mm:ss'),
  },
  // 更新时间列
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={followerCollectTaskFieldMap.updatedAt} />,
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt')
      return <div className='text-center'>{updatedAt ? format(updatedAt as Date, 'yyyy-MM-dd HH:mm:ss') : '--'}</div>
    },
  },
  // // 操作列
  // {
  //   id: 'actions',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='操作' />,
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
] 