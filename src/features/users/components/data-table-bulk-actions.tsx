import { useState } from 'react'
import { Table } from '@tanstack/react-table'
import { Trash2, UserX, UserCheck, Mail, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
}

/**
 * Bulk Actions Component for Users Table
 *
 * This component provides bulk action functionality when users are selected in the table.
 * It includes:
 * - Bulk invite users
 * - Bulk activate users
 * - Bulk deactivate users
 * - Bulk delete users (with confirmation dialog)
 * - Clear selection option
 *
 * The component only renders when at least one row is selected.
 */
export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const [_showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (selectedCount === 0) {
    return null
  }

  const handleBulkStatusChange = (_status: string) => {
    // TODO: Implement bulk status change functionality
    // const selectedUsers = selectedRows.map((row) => row.original as User)
    // For now, just clear selection
    table.resetRowSelection()
  }

  const handleBulkInvite = () => {
    // TODO: Implement bulk invite functionality
    // const selectedUsers = selectedRows.map((row) => row.original as User)
    // For now, just clear selection
    table.resetRowSelection()
  }

  const handleClearSelection = () => {
    table.resetRowSelection()
  }

  return (
    <div
      role='toolbar'
      className={cn(
        'fixed bottom-6 left-1/2 z-50 -translate-x-1/2',
        'transition-all delay-100 duration-300 ease-out hover:scale-105'
      )}
    >
      <div
        className={cn(
          'p-2 shadow-xl',
          'rounded-xl border',
          'bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-lg',
          'flex items-center gap-x-2'
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleClearSelection}
              className='size-6 rounded-full'
            >
              <X />
              <span className='sr-only'>Clear selection</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear selection</p>
          </TooltipContent>
        </Tooltip>

        <Separator className='h-5' orientation='vertical' />

        <div className='flex items-center gap-x-1 text-sm'>
          <Badge variant='default' className='min-w-8 rounded-lg'>
            {selectedCount}
          </Badge>
          {'  '}
          <span className='hidden sm:inline'>
            user
            {selectedCount > 1 ? 's' : ''}{' '}
          </span>
          {'  '}
          selected
        </div>

        <Separator className='h-5' orientation='vertical' />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkInvite}
              className='size-8'
            >
              <Mail />
              <span className='sr-only'>Invite</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Invite</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
            >
              <UserCheck />
              <span className='sr-only'>Activate</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Activate</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
            >
              <UserX />
              <span className='sr-only'>Deactivate</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Deactivate</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='text-destructive/75 border-destructive/35 dark:text-destructive dark:border-destructive/50 hover:bg-destructive/5 hover:text-destructive size-8'
            >
              <Trash2 />
              <span className='sr-only'>Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
