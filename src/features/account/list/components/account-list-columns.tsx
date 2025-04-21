import { ColumnDef } from '@tanstack/react-table'
import { DataTableRowActions } from './data-table-row-actions'
import { Account, AccountStatusMap } from '../data/schema'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
  },
  // ID列
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    // cell: ({ row }) => <div>{row.getValue('id')}</div>,
    cell: ({ row }) => {
      const original = row.original
      return <div className='flex flex-col items-start gap-2'>
        <Button variant="outline" size="xs" onClick={() => {
          navigator.clipboard.writeText(original.uid)
          toast.success('UID已复制到剪贴板')
        }}>
          复制UID
        </Button>
        <Button variant="outline" size="xs" onClick={() => {
          navigator.clipboard.writeText(original.secUid)
          toast.success('SECUID已复制到剪贴板')
        }}>
          复制SECUID
        </Button>
      </div>
    },
  },
    // 分组列
    {
      accessorKey: 'group',
      header: ({ column }) => <DataTableColumnHeader column={column} title='分组' />,
      cell: ({ row }) => {
        const group = row.original.group
        return <div>{group ? group.name : '--'}</div>
      },
    },
   // 用户名列
   {
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader column={column} title='用户名' />,
    cell: ({ row }) => <div>{row.getValue('username') || '--'}</div>,
  },
  // 头像
  {
    accessorKey: 'avatar',
    header: ({ column }) => <DataTableColumnHeader column={column} title='头像' />,
    cell: ({ row }) => <Avatar className='h-14 w-14 mr-2'>
      <AvatarImage src={row.getValue('avatar') || ''} alt={row.getValue('nickname') || ''} />
      <AvatarFallback delayMs={600}></AvatarFallback>
    </Avatar>,
    enableSorting: false,
  },
  // 昵称等基本信息
  {
    accessorKey: 'nickname',
    header: ({ column }) => <DataTableColumnHeader column={column} title='昵称' />,
    cell: ({ row }) => {
      return <div className='flex flex-col items-start gap-2 font-normal text-xs'>
        <div><Badge className='mr-2 font-normal' variant="outline">昵称</Badge><span>{row.getValue('nickname') || '--'}</span></div>
        <div><Badge className='mr-2 font-normal' variant="outline">签名</Badge><span>{ row.original.signature || '--'}</span></div>
      </div>
    },
    enableSorting: false,
  },
  // 关注数列
  {
    accessorKey: 'following',
    header: ({ column }) => <DataTableColumnHeader column={column} title='关注数' />,
    cell: ({ row }) => <div className='text-center'>{row.getValue('following')}</div>,
  },
  // 粉丝数列
  {
    accessorKey: 'followers',
    header: ({ column }) => <DataTableColumnHeader column={column} title='粉丝数' />,
    cell: ({ row }) => <div className='text-center'>{row.getValue('followers')}</div>,
  },
  // 作品数列
  {
    accessorKey: 'awemeCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='作品数' />,
    cell: ({ row }) => <div className='text-center'>{row.getValue('awemeCount')}</div>,
  },
  // 状态列
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='状态' />,
    cell: ({ row }) => {
      const status = row.getValue('status')
      return (
        <Badge variant={status === '1' ? 'default' : status === '0' ? 'secondary' : 'destructive'}>
          {AccountStatusMap[status as keyof typeof AccountStatusMap] || '未知'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // 地区列
  {
    accessorKey: 'region',
    header: ({ column }) => <DataTableColumnHeader column={column} title='地区' />,
    cell: ({ row }) => <div className='text-center'>{row.getValue('region')}</div>,
  },
  // 创建时间列
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='创建时间' />,
    cell: ({ row }) => format(row.getValue('createdAt'), 'yyyy-MM-dd HH:mm:ss'),
  },
  // 更新时间列
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='更新时间' />,
    cell: ({ row }) =>{
      const updatedAt = row.getValue('updatedAt')
      return <div className='text-center'>{updatedAt ? format(updatedAt as Date, 'yyyy-MM-dd HH:mm:ss') : '--'}</div>
    },
  },
  // 操作列
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title='操作' />,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 