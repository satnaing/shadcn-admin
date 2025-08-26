import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '../components/data-table-column-header'
import { DataTableRowActions } from '../components/data-table-row-actions'
import { executionStatuses } from './data'
import { type Execution } from './schema'

// Extend the table meta type
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    playbooks?: Record<string, { id: string; name: string }>
  }
}

export const executionsColumns: ColumnDef<Execution>[] = [
  {
    accessorKey: 'playbookId',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Playbook' />,
    cell: ({ row, table }) => {
      const playbookId = row.getValue('playbookId') as string | null

      if (!playbookId) {
        return <span className='text-muted-foreground'>-</span>
      }

      // Get playbook name from table meta (will be set by the parent component)
      const playbookName = table.options.meta?.playbooks?.[playbookId]?.name

      return (
        <div className='w-[160px]'>
          <span className='truncate'>{playbookName || playbookId}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const playbookId = row.getValue(id)
      return value.includes(playbookId)
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = executionStatuses.find((status) => status.value === row.getValue('status'))

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[140px] items-center gap-2'>
          {status.icon && (
            <status.icon
              className={`size-4 ${
                status.icon.displayName === 'Loader2' ? 'animate-spin' : ''
              } text-muted-foreground`}
            />
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
    accessorKey: 'result',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Summary' />,
    cell: ({ row }) => {
      const summary = (row.getValue('result') as any)?.shortSummary as string | null

      if (!summary) {
        return <span className='text-muted-foreground'>No summary</span>
      }

      const truncated = summary.length > 80 ? `${summary.substring(0, 80)}...` : summary

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='max-w-[300px] cursor-default'>{truncated}</span>
            </TooltipTrigger>
            {summary.length > 80 && (
              <TooltipContent className='max-w-[400px] whitespace-pre-wrap'>
                {summary}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
  {
    accessorKey: 'completedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Completed At' />,
    cell: ({ row }) => {
      const completedAt = row.getValue('completedAt') as string | null
      return (
        <div className='w-[160px]'>
          {completedAt ? format(new Date(completedAt), 'MMM d, yyyy HH:mm') : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Started At' />,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string
      return <div className='w-[160px]'>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</div>
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Type' />,
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return (
        <div className='w-[100px]'>
          <span>{type === 'PLAYBOOK' ? 'Playbook' : 'User'}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
