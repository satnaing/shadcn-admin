import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { IconTrash } from '@tabler/icons-react'
import type { Row } from '@tanstack/react-table'
import { useState } from 'react'
import { Link, useFetcher, useSearchParams } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { TaskDeleteConfirmDialog } from '../../$task.delete/route'
import { labels } from '../../_shared/data/data'
import { taskSchema } from '../../_shared/data/schema'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = taskSchema.parse(row.original)
  const fetcher = useFetcher({ key: `task-label-${task.id}` })
  const [searchParams] = useSearchParams()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <Link to={`/tasks/${task.id}?${searchParams.toString()}`}>
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Make a copy</DropdownMenuItem>
          <DropdownMenuItem disabled>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={task.label}
                onValueChange={(value) => {
                  fetcher.submit(
                    { id: task.id, label: value },
                    {
                      action: `/tasks/${task.id}/label`,
                      method: 'POST',
                    },
                  )
                }}
              >
                {labels.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            onSelect={() => setDeleteDialogOpen(true)}
          >
            Delete
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TaskDeleteConfirmDialog
        task={task}
        open={deleteDialogOpen}
        onOpenChange={(v) => {
          setDeleteDialogOpen(v)
        }}
      />
    </>
  )
}
