import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { type CampaignContactStatusReason } from '@/graphql/global/types.generated'
import { Play, Pause } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loadable } from '@/components/loadable'
import { DataTableColumnHeader } from '../components/data-table-column-header'
import { statuses, statusReasonLabels } from './data'
import type { CampaignContactTableRow } from './schema'

type ColumnOptions = {
  onTogglePause: (contactId: string, isRunning: boolean) => void
  loadingContactIds: Set<string>
}

export const createOutreachColumns = ({
  onTogglePause,
  loadingContactIds,
}: ColumnOptions): ColumnDef<CampaignContactTableRow>[] => [
  {
    id: 'actions',
    header: () => null,
    enableSorting: false,
    cell: ({ row }) => {
      const contact = row.original
      const isRunning = ['PENDING', 'CONNECTION_SENT', 'RUNNING', 'MESSAGED'].includes(
        contact.status
      )
      const canToggle = !['REPLIED', 'FINISHED', 'ERROR'].includes(contact.status)
      const isLoading = loadingContactIds.has(contact.id)

      // Check if contact can be resumed - only allow if manually stopped
      const canResume = !isRunning && contact.statusReason === 'STOPPED_MANUAL_STOP'

      // Don't show button if contact can't be toggled at all
      if (!canToggle) return null

      // Don't show play button if contact can't be resumed (but show pause button for running contacts)
      if (!isRunning && !canResume) return null

      return (
        <div className='flex items-center justify-center'>
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0'
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation()
              onTogglePause(contact.id, isRunning)
            }}
          >
            <Loadable isLoading={isLoading}>
              {isRunning ? <Pause className='h-4 w-4' /> : <Play className='h-4 w-4' />}
            </Loadable>
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: 'contact',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Contact' />,
    enableSorting: false,
    cell: ({ row }) => {
      const contact = row.original.contact
      const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ')
      const initials = [contact.firstName?.[0], contact.lastName?.[0]]
        .filter(Boolean)
        .join('')
        .toUpperCase()

      return (
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={contact.profilePicUrl || ''} alt={fullName} />
            <AvatarFallback>{initials || '??'}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            {contact.linkedinUrl ? (
              <div onClick={(e) => e.stopPropagation()} className='w-fit'>
                <a
                  href={contact.linkedinUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-medium hover:underline'
                >
                  {fullName || 'Unknown'}
                </a>
              </div>
            ) : (
              <span className='font-medium'>{fullName || 'Unknown'}</span>
            )}
            {contact.workEmail && (
              <span className='text-muted-foreground text-xs'>{contact.workEmail}</span>
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'contact.company',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Company' />,
    enableSorting: false,
    cell: ({ row }) => {
      const contact = row.original.contact
      return (
        <div className='flex max-w-[200px] flex-col'>
          {contact.company?.domain ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className='w-fit max-w-[150px] truncate hover:underline'
            >
              <a
                href={
                  contact.company.domain.startsWith('http')
                    ? contact.company.domain
                    : `https://${contact.company.domain}`
                }
                target='_blank'
                rel='noopener noreferrer'
              >
                {contact.company?.name || contact.company?.domain}
              </a>
            </div>
          ) : (
            <span className='truncate font-medium'>
              {contact.company?.name || contact.company?.domain || '-'}
            </span>
          )}
          {contact.title && (
            <span className='text-muted-foreground truncate text-xs'>{contact.title}</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    enableSorting: false,
    cell: ({ row }) => {
      const status = statuses.find((s) => s.value === row.getValue('status'))
      if (!status) return null

      return (
        <div className='flex items-center'>
          {status.icon && <status.icon className={`mr-2 h-4 w-4 ${status.color}`} />}
          <span>{status.label}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'statusReason',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Reason' />,
    enableSorting: false,
    cell: ({ row }) => {
      const reason = row.getValue('statusReason') as string | null
      if (!reason) return <span className='text-muted-foreground'>-</span>

      const label = statusReasonLabels[reason as CampaignContactStatusReason]

      return <Badge variant='outline'>{label}</Badge>
    },
  },
  {
    accessorKey: 'sender',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sender' />,
    enableSorting: false,
    cell: ({ row }) => {
      const sender = row.original.sender
      if (!sender) return <span className='text-muted-foreground'>-</span>

      const initials = sender.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      return (
        <div className='flex items-center gap-2'>
          <Avatar className='h-6 w-6'>
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
          <span className='text-sm'>{sender.name}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'repliedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Replied' />,
    enableSorting: false,
    cell: ({ row }) => {
      const repliedAt = row.getValue('repliedAt') as string | null
      if (!repliedAt) return <span className='text-muted-foreground'>Not yet</span>
      return <span>{format(new Date(repliedAt), 'MMM d, yyyy')}</span>
    },
  },
  {
    accessorKey: 'execution',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Execution' />,
    enableSorting: false,
    cell: ({ row }) => {
      const { executionId } = row.original.contact
      if (!executionId) return <span className='text-muted-foreground'>-</span>

      return (
        <Link to='/activity' search={{ executionId }} onClick={(e) => e.stopPropagation()}>
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-foreground h-auto p-1 text-xs'
          >
            {executionId} ⬈
          </Button>
        </Link>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Started' />,
    enableSorting: false,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string
      return <span>{format(new Date(createdAt), 'MMM d, yyyy')}</span>
    },
  },
]
