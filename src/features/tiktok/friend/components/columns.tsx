import { ColumnDef } from "@tanstack/react-table";
import { TiktokFriend, friendListFieldMap } from "../schema";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const columns: ColumnDef<TiktokFriend>[] = [
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
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.id} />,
    cell: ({ row }) => {
      const original = row.original
      return <div className='flex flex-col items-start gap-2'>
        <Button variant="outline" size="xs" onClick={() => {
          navigator.clipboard.writeText(original.uid)
          toast.success('UID已复制到剪贴板', { duration: 2000 })
        }}>
          复制UID
        </Button>
        <Button variant="outline" size="xs" onClick={() => {
          navigator.clipboard.writeText(original.secUid)
          toast.success('SECUID已复制到剪贴板', { duration: 2000 })
        }}>
          复制SECUID
        </Button>
      </div>
    },
  },
  {
    accessorKey: 'task',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.task} />,
    cell: ({ row }) => <Badge variant="outline">{row.original.task.name}</Badge>
  },
  {
    accessorKey: 'accountGroup',
    header: ({ column }) => <DataTableColumnHeader column={column} title="账号组" />,
    cell: ({ row }) => <Badge variant="outline">{row.original.task.group.name}</Badge>
  },
  {
    accessorKey: 'account',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.account} />,
    cell: ({ row }) => <Badge variant="outline">{row.original.account.username}</Badge>
  },
  {
    accessorKey: 'uniqueId',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.uniqueId} />,
    cell: ({ row }) => <div>{row.getValue('uniqueId')}</div>
  },
  // 头像
  {
    accessorKey: 'avatar',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.avatar} />,
    cell: ({ row }) => <Avatar className='h-14 w-14 mr-2'>
      <AvatarImage src={row.getValue('avatar') || undefined} alt={row.getValue('nickname') || ''} />
      <AvatarFallback delayMs={600}></AvatarFallback>
    </Avatar>,
    enableSorting: false,
  },
  // 昵称等基本信息
  {
    accessorKey: 'nickname',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.nickname} />,
    cell: ({ row }) => {
      return <div className='flex flex-col items-start gap-2 font-normal text-xs'>
        <div><Badge className='mr-2 font-normal' variant="outline">昵称</Badge><span>{row.getValue('nickname') || '--'}</span></div>
        <div><Badge className='mr-2 font-normal' variant="outline">签名</Badge><span>{row.original.signature || '--'}</span></div>
      </div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'followingCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.followingCount} />,
    cell: ({ row }) => <div>{row.getValue('followingCount')}</div>
  },
  {
    accessorKey: 'followerCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.followerCount} />,
    cell: ({ row }) => <div>{row.getValue('followerCount')}</div>
  },
  {
    accessorKey: 'awemeCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.awemeCount} />,
    cell: ({ row }) => <div>{row.getValue('awemeCount')}</div>
  },
  {
    accessorKey: 'favoritingCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.favoritingCount} />,
    cell: ({ row }) => <div>{row.getValue('favoritingCount')}</div>
  },
  {
    accessorKey: 'totalFavorited',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.totalFavorited} />,
    cell: ({ row }) => <div>{row.getValue('totalFavorited')}</div>
  },
  // 地区列
  {
    accessorKey: 'region',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.region} />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue('region')}</Badge>,
  },
  {
    accessorKey: 'language',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.language} />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue('language')}</Badge>
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.createdAt} />,
    cell: ({ row }) => <div>{row.getValue('createdAt')}</div>
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title={friendListFieldMap.updatedAt} />,
    cell: ({ row }) => <div>{row.getValue('updatedAt')}</div>
  }
]