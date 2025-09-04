import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '../components/data-table-column-header'
import { DataTableRowActions } from '../components/data-table-row-actions'
import { parseSlackMarkdown } from '../utils/slack-markdown-parser'
import { executionStatuses } from './data'
import { type Execution } from './schema'

// Extend the table meta type
declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface TableMeta<TData> {
    playbooks?: Record<string, { id: string; name: string }>
  }
}

export const executionsColumns: ColumnDef<Execution>[] = [
  {
    accessorKey: 'identity',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Company' />,
    cell: ({ row }) => {
      const identity = row.getValue('identity') as {
        name: string
        type: string
        url: string
      } | null

      if (!identity) {
        return <span className='text-muted-foreground'>-</span>
      }

      const formatUrl = (url: string) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
          return url
        }
        return `https://${url}`
      }

      const content = (
        <>
          {identity.type === 'COMPANY' && identity.url && (
            <img
              src={`https://logo.clearbit.com/${identity.url}`}
              alt={`${identity.name} logo`}
              className='size-4 rounded-sm object-contain'
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.style.display = 'none'
              }}
            />
          )}
          <span className='truncate text-sm'>{identity.name}</span>
        </>
      )

      return (
        <div className='flex w-[140px] items-center gap-2'>
          {identity.url ? (
            <a
              href={formatUrl(identity.url)}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2 hover:underline'
            >
              {content}
            </a>
          ) : (
            content
          )}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
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
      return playbookId === value
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

      const getStatusColor = (statusValue: string) => {
        switch (statusValue) {
          case 'COMPLETED':
            return 'text-green-600'
          case 'FAILED':
            return 'text-red-600'
          case 'CANCELLED':
            return 'text-orange-600'
          case 'IN_PROGRESS':
            return 'text-blue-600'
          case 'AWAITING_APPROVAL':
            return 'text-yellow-600'
          case 'NOT_STARTED':
          default:
            return 'text-gray-500'
        }
      }

      return (
        <div className='flex w-[140px] items-center gap-2'>
          {status.icon && (
            <status.icon
              className={`size-4 ${
                status.icon.displayName === 'Loader2' ? 'animate-spin' : ''
              } ${getStatusColor(status.value)}`}
            />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return row.getValue(id) === value
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

      return (
        <div className='w-[400px]'>
          <div className='text-sm break-words whitespace-normal'>{parseSlackMarkdown(summary)}</div>
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
      return row.getValue(id) === value
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
