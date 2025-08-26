import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Execution } from '../data/schema'
import { useExecutions } from './executions-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const execution = row.original as Execution
  const { setOpen, setCurrentExecution } = useExecutions()

  const handleViewDetails = () => {
    setCurrentExecution(execution)
    setOpen('view')
  }

  const handleCancel = () => {
    setCurrentExecution(execution)
    setOpen('cancel')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='data-[state=open]:bg-muted flex h-8 w-8 p-0'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleViewDetails}>View Details</DropdownMenuItem>
        <DropdownMenuSeparator />
        {execution.status === 'IN_PROGRESS' || execution.status === 'AWAITING_APPROVAL' ? (
          <DropdownMenuItem onClick={handleCancel} className='text-destructive'>
            Cancel Execution
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(execution.id)}>
          Copy Execution ID
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
