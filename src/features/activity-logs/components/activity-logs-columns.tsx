import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import LongText from '@/components/long-text'
import {
  ActivityLog,
  getActionLabel,
  getSeverityBadgeVariant,
} from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Timestamp' />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue('timestamp') as Date
      return (
        <div className='flex flex-col'>
          <span className='text-sm font-medium'>
            {format(timestamp, 'MMM dd, yyyy')}
          </span>
          <span className='text-xs text-muted-foreground'>
            {format(timestamp, 'HH:mm:ss')}
          </span>
        </div>
      )
    },
    meta: {
      className: 'w-40',
    },
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => {
      const { userName, userAvatar } = row.original
      const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      return (
        <div className='flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
          <LongText className='max-w-32'>{userName}</LongText>
        </div>
      )
    },
    meta: {
      className: 'w-48',
    },
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Action' />
    ),
    cell: ({ row }) => {
      const action = row.getValue('action') as ActivityLog['action']
      return <div className='font-medium'>{getActionLabel(action)}</div>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: {
      className: 'w-48',
    },
  },
  {
    accessorKey: 'resource',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Resource' />
    ),
    cell: ({ row }) => {
      const resource = row.getValue('resource') as string
      return (
        <Badge variant='secondary' className='capitalize'>
          {resource}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    meta: {
      className: 'w-32',
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <LongText className='max-w-80'>{row.getValue('description')}</LongText>
    ),
  },
  {
    accessorKey: 'severity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Severity' />
    ),
    cell: ({ row }) => {
      const severity = row.getValue('severity') as ActivityLog['severity']
      const variant = getSeverityBadgeVariant(severity)

      return (
        <Badge variant={variant} className='capitalize'>
          {severity}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    meta: {
      className: 'w-28',
    },
  },
  {
    accessorKey: 'ipAddress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='IP Address' />
    ),
    cell: ({ row }) => (
      <div className='font-mono text-xs'>{row.getValue('ipAddress')}</div>
    ),
    enableSorting: false,
  },
]
