import { type ColumnDef } from '@tanstack/react-table'
import i18next from 'i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { Status } from '@/components/status'
import type { UserInterface } from '../data/users.type'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<UserInterface>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={i18next.t('users:columns.selectAll')}
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={i18next.t('users:columns.selectRow')}
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
      <LongText className='max-w-36 ps-3'>{row.getValue('name')}</LongText>
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
    cell: DataTableRowActions,
    enableSorting: false,
  },
]
