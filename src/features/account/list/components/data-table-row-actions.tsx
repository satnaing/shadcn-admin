import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Trash, Edit } from 'lucide-react'
import { useAccountListContext } from '../context/account-list-context'
import { Account } from '../data/schema'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// 表格行操作组件Props
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

// 表格行操作组件实现
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const account = row.original as Account
  const { setOpen, setCurrent } = useAccountListContext()

  // 删除账号组
  const onDelete = () => {
    setCurrent(account)
    setOpen('delete')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>打开菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={onDelete}>
          <Trash className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
          删除
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 