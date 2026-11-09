import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { useTaskLabels, useTaskPriorities, useTaskStatuses } from '../data/data'
import { type Task } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function useTasksColumns(): ColumnDef<Task>[] {
  const { t } = useTranslation('tasks')
  const labels = useTaskLabels()
  const statuses = useTaskStatuses()
  const priorities = useTaskPriorities()

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('columns.selectAll')}
          className='translate-y-0.5'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('columns.selectRow')}
          className='translate-y-0.5'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.task')} />
      ),
      cell: ({ row }) => <div className='w-20'>{row.getValue('id')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.title')} />
      ),
      meta: {
        className: 'ps-1 max-w-0 w-2/3',
        tdClassName: 'ps-4',
      },
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.label)

        return (
          <div className='flex space-x-2'>
            {label && <Badge variant='outline'>{label.label}</Badge>}
            <span className='truncate font-medium'>
              {row.getValue('title')}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.status')} />
      ),
      meta: { className: 'ps-1', tdClassName: 'ps-4' },
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue('status')
        )

        if (!status) {
          return null
        }

        return (
          <div className='flex w-25 items-center gap-2'>
            {status.icon && (
              <status.icon className='size-4 text-muted-foreground' />
            )}
            <span>{status.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('columns.priority')} />
      ),
      meta: { className: 'ps-1', tdClassName: 'ps-3' },
      cell: ({ row }) => {
        const priority = priorities.find(
          (priority) => priority.value === row.getValue('priority')
        )

        if (!priority) {
          return null
        }

        return (
          <div className='flex items-center gap-2'>
            {priority.icon && (
              <priority.icon className='size-4 text-muted-foreground' />
            )}
            <span>{priority.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]
}
