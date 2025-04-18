import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AccountGroup } from '../data/schema'
import { useAccountGroupsContext } from '../context/account-groups-context'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData extends AccountGroup>({
  row,
}: DataTableRowActionsProps<TData>) {
  const accountGroup = row.original
  const { setOpen, setCurrentGroup } = useAccountGroupsContext()

  // 编辑账号组
  const onEdit = () => {
    setCurrentGroup(accountGroup)
    setOpen('edit')
  }

  // 删除账号组
  const onDelete = () => {
    setCurrentGroup(accountGroup)
    setOpen('delete')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">打开菜单</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          <span>编辑</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          <span>删除</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 