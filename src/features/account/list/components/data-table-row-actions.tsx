import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Trash, Edit, RefreshCcw } from 'lucide-react'
import { useAccountListContext } from '../context/account-list-context'
import { Account } from '../data/schema'
import { accountService } from '@/services/account-services'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Result } from '@/types/result'

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

  const queryClient = useQueryClient()
  
  // 删除账号
  const onDelete = () => {
    setCurrent(account)
    setOpen('delete')
  }

  const { mutate: refreshAccount, isPending: isRefreshing } = useMutation({
    mutationFn: () => accountService.refreshAccount(account.id),
    onSuccess: () => {
      toast.success(`账号刷新成功`, { duration: 2000 })
      queryClient.invalidateQueries({ queryKey: [accountService.path] })
    },
    onError: (error: AxiosError<Result<unknown>>) => {
      console.error('刷新账号失败', error)
      toast.error(`${error.response?.data?.message || error.message}`, { duration: 5000, description: error.response?.data?.desc })
    }
  })

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
        <DropdownMenuItem onClick={() => refreshAccount()} disabled={isRefreshing}>
          <RefreshCcw className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
          {isRefreshing ? '刷新中...' : '刷新'}
          <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
          删除
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 