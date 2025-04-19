import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Account, AccountStatusMap } from '../data/schema'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

// 账号列表表格列定义
export const columns: ColumnDef<Account>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  // ID列
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({ row }) => <div className='w-[40px]'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  // 头像和昵称列
  {
    accessorKey: 'nickname',
    header: ({ column }) => <DataTableColumnHeader column={column} title='昵称' />,
    cell: ({ row }) => {
      const account = row.original
      return (
        <div className='flex items-center'>
          <Avatar className='h-8 w-8 mr-2'>
            <AvatarImage src={account.avatar || ''} alt={account.nickname || ''} />
            <AvatarFallback>{(account.nickname || '').substring(0, 2)}</AvatarFallback>
          </Avatar>
          <span className='font-medium'>{account.nickname || '--'}</span>
        </div>
      )
    },
    enableSorting: true,
  },
  // 用户名列
  {
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader column={column} title='用户名' />,
    cell: ({ row }) => <div>{row.getValue('username') || '--'}</div>,
  },
  // UID列
  {
    accessorKey: 'uid',
    header: ({ column }) => <DataTableColumnHeader column={column} title='UID' />,
    cell: ({ row }) => <div className='font-medium'>{row.getValue('uid') || '--'}</div>,
  },
  // 分组列
  {
    accessorKey: 'group',
    header: ({ column }) => <DataTableColumnHeader column={column} title='分组' />,
    cell: ({ row }) => {
      const group = row.original.group
      return <div>{group ? group.name : '--'}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id)?.id)
    },
  },
  // 关注数列
  {
    accessorKey: 'following',
    header: ({ column }) => <DataTableColumnHeader column={column} title='关注数' />,
    cell: ({ row }) => <div className='text-right'>{row.getValue('following')}</div>,
  },
  // 粉丝数列
  {
    accessorKey: 'followers',
    header: ({ column }) => <DataTableColumnHeader column={column} title='粉丝数' />,
    cell: ({ row }) => <div className='text-right'>{row.getValue('followers')}</div>,
  },
  // 状态列
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='状态' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as number
      return (
        <Badge variant={status === 1 ? 'default' : 'destructive'}>
          {AccountStatusMap[status.toString()] || '未知'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // 创建时间列
  {
    accessorKey: 'createAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='创建时间' />,
    cell: ({ row }) => {
      const date = row.getValue('createAt') as Date
      return <div className='font-medium'>{date.toLocaleString()}</div>
    },
  },
  // 操作列
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 