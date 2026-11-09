import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, CircleArrowUp, ArrowUpDown, Download } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { useTaskPriorities, useTaskStatuses } from '../data/data'
import { type Task } from '../data/schema'
import { TasksMultiDeleteDialog } from './tasks-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const { t } = useTranslation('tasks')
  const statuses = useTaskStatuses()
  const priorities = useTaskPriorities()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: string) => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    const statusLabel =
      statuses.find((s) => s.value === status)?.label ?? status
    toast.promise(sleep(2000), {
      loading: t('bulkActions.updatingStatus'),
      success: () => {
        table.resetRowSelection()
        return t('bulkActions.statusUpdated', {
          count: selectedTasks.length,
          status: statusLabel,
        })
      },
      error: t('bulkActions.error'),
    })
    table.resetRowSelection()
  }

  const handleBulkPriorityChange = (priority: string) => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    const priorityLabel =
      priorities.find((p) => p.value === priority)?.label ?? priority
    toast.promise(sleep(2000), {
      loading: t('bulkActions.updatingPriority'),
      success: () => {
        table.resetRowSelection()
        return t('bulkActions.priorityUpdated', {
          count: selectedTasks.length,
          priority: priorityLabel,
        })
      },
      error: t('bulkActions.error'),
    })
    table.resetRowSelection()
  }

  const handleBulkExport = () => {
    const selectedTasks = selectedRows.map((row) => row.original as Task)
    toast.promise(sleep(2000), {
      loading: t('bulkActions.exporting'),
      success: () => {
        table.resetRowSelection()
        return t('bulkActions.exported', { count: selectedTasks.length })
      },
      error: t('bulkActions.error'),
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName={t('entity')}>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label={t('bulkActions.updateStatus')}
                  title={t('bulkActions.updateStatus')}
                >
                  <CircleArrowUp />
                  <span className='sr-only'>
                    {t('bulkActions.updateStatus')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('bulkActions.updateStatus')}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                defaultValue={status.value}
                onClick={() => handleBulkStatusChange(status.value)}
              >
                {status.icon && (
                  <status.icon className='size-4 text-muted-foreground' />
                )}
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label={t('bulkActions.updatePriority')}
                  title={t('bulkActions.updatePriority')}
                >
                  <ArrowUpDown />
                  <span className='sr-only'>
                    {t('bulkActions.updatePriority')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('bulkActions.updatePriority')}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {priorities.map((priority) => (
              <DropdownMenuItem
                key={priority.value}
                defaultValue={priority.value}
                onClick={() => handleBulkPriorityChange(priority.value)}
              >
                {priority.icon && (
                  <priority.icon className='size-4 text-muted-foreground' />
                )}
                {priority.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label={t('bulkActions.exportTasks')}
              title={t('bulkActions.exportTasks')}
            >
              <Download />
              <span className='sr-only'>{t('bulkActions.exportTasks')}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('bulkActions.exportTasks')}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label={t('bulkActions.deleteSelected')}
              title={t('bulkActions.deleteSelected')}
            >
              <Trash2 />
              <span className='sr-only'>
                {t('bulkActions.deleteSelected')}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('bulkActions.deleteSelected')}</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <TasksMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
