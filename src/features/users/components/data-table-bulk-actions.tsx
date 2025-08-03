import { useState, useEffect, useRef } from 'react'
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
import { UsersMultiDeleteDialog } from './users-multi-delete-dialog'

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [announcement, setAnnouncement] = useState('')

  // Announce selection changes to screen readers
  useEffect(() => {
    if (selectedCount > 0) {
      const message = `${selectedCount} user${selectedCount > 1 ? 's' : ''} selected. Bulk actions toolbar is available.`
      setAnnouncement(message)

      // Clear announcement after a delay
      const timer = setTimeout(() => setAnnouncement(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [selectedCount])

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Handle keyboard navigation within the toolbar
    const buttons = toolbarRef.current?.querySelectorAll('button')
    if (!buttons) return

    const currentIndex = Array.from(buttons).findIndex(
      (button) => button === document.activeElement
    )

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault()
        const nextIndex = (currentIndex + 1) % buttons.length
        buttons[nextIndex]?.focus()
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        const prevIndex =
          currentIndex === 0 ? buttons.length - 1 : currentIndex - 1
        buttons[prevIndex]?.focus()
        break
      }
      case 'Home':
        event.preventDefault()
        buttons[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        buttons[buttons.length - 1]?.focus()
        break
      case 'Escape': {
        // Check if the Escape key came from a dropdown trigger or content
        // We can't check dropdown state because Radix UI closes it before our handler runs
        const target = event.target as HTMLElement
        const activeElement = document.activeElement as HTMLElement

        // Check if the event target or currently focused element is a dropdown trigger
        const isFromDropdownTrigger =
          target?.getAttribute('data-slot') === 'dropdown-menu-trigger' ||
          activeElement?.getAttribute('data-slot') ===
            'dropdown-menu-trigger' ||
          target?.closest('[data-slot="dropdown-menu-trigger"]') ||
          activeElement?.closest('[data-slot="dropdown-menu-trigger"]')

        // Check if the focused element is inside dropdown content (which is portaled)
        const isFromDropdownContent =
          activeElement?.closest('[data-slot="dropdown-menu-content"]') ||
          target?.closest('[data-slot="dropdown-menu-content"]')

        if (isFromDropdownTrigger || isFromDropdownContent) {
          // Escape was meant for the dropdown - don't clear selection
          return
        }

        // Escape was meant for the toolbar - clear selection
        event.preventDefault()
        handleClearSelection()
        break
      }
    }
  }

  return (
    <>
      {/* Live region for screen reader announcements */}
      <div
        aria-live='polite'
        aria-atomic='true'
        className='sr-only'
        role='status'
      >
        {announcement}
      </div>

      <div
        ref={toolbarRef}
        role='toolbar'
        aria-label={`Bulk actions for ${selectedCount} selected user${selectedCount > 1 ? 's' : ''}`}
        aria-describedby='bulk-actions-description'
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          'fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl',
          'transition-all delay-100 duration-300 ease-out hover:scale-105',
          'focus-visible:ring-ring/50 focus-visible:ring-2 focus-visible:outline-none'
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
                aria-label='Clear selection'
                title='Clear selection (Escape)'
              >
                <X />
                <span className='sr-only'>Clear selection</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear selection (Escape)</p>
            </TooltipContent>
          </Tooltip>

          <Separator
            className='h-5'
            orientation='vertical'
            aria-hidden='true'
          />

          <div
            className='flex items-center gap-x-1 text-sm'
            id='bulk-actions-description'
          >
            <Badge
              variant='default'
              className='min-w-8 rounded-lg'
              aria-label={`${selectedCount} selected`}
            >
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

          <Separator
            className='h-5'
            orientation='vertical'
            aria-hidden='true'
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={handleBulkInvite}
                className='size-8'
                aria-label='Invite selected users'
                title='Invite selected users'
              >
                <Mail />
                <span className='sr-only'>Invite selected users</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Invite selected users</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleBulkStatusChange('active')}
                className='size-8'
                aria-label='Activate selected users'
                title='Activate selected users'
              >
                <UserCheck />
                <span className='sr-only'>Activate selected users</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Activate selected users</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => handleBulkStatusChange('inactive')}
                className='size-8'
                aria-label='Deactivate selected users'
                title='Deactivate selected users'
              >
                <UserX />
                <span className='sr-only'>Deactivate selected users</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Deactivate selected users</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setShowDeleteConfirm(true)}
                className='text-destructive/75 border-destructive/35 dark:text-destructive dark:border-destructive/50 hover:bg-destructive/5 hover:text-destructive size-8'
                aria-label='Delete selected users'
                title='Delete selected users'
              >
                <Trash2 />
                <span className='sr-only'>Delete selected users</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected users</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
