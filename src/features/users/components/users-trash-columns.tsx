import { type ColumnDef } from '@tanstack/react-table'
import { getInitials } from '@/shared/helper'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { Status } from '@/components/status'
import type { UserInterface } from '../data/users.type'
import { TrashUsersTableRowActions } from './users-trash-table-row-actions'

export const trashUsersColumns: ColumnDef<UserInterface>[] = [
  {
    accessorKey: 'id',
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} titleKey='users:columns.id' />
    ),
    cell: ({ row }) => <span className='w-8'>#{row.getValue('id')}</span>,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} titleKey='users:columns.name' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full border'>
          <span>{getInitials(row.original?.name)}</span>
        </div>
        <div>
          <LongText className='max-w-36 ps-3'>{row.getValue('name')}</LongText>
          <div>{row.original?.email}</div>
        </div>
      </div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} titleKey='users:columns.email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
    ),
    enableSorting: true,
  },
  {
    id: 'status',
    accessorKey: 'status_label',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} titleKey='users:columns.status' />
    ),
    cell: ({ row }) => <Status value={row.original.status} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: true,
  },
  {
    id: 'role',
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} titleKey='users:columns.role' />
    ),
    cell: ({ row }) => {
      const { roles } = row.original

      return (
        <div className=''>
          {roles.map((role) => (
            <span key={role.id} className='text-sm capitalize'>
              {role.name}
            </span>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        titleKey='users:columns.createdAt'
      />
    ),
    enableSorting: true,
  },
  {
    id: 'actions',
    header: () => null,
    cell: TrashUsersTableRowActions,
    enableSorting: false,
  },
]
