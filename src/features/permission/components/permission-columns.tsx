import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import type { PermissionEntityInterface } from '../data/permission.type'
import { PermissionTableRowActions } from './permission-table-row-actions'

export const permissionColumns: ColumnDef<PermissionEntityInterface>[] = [
  {
    accessorKey: 'id',
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} titleKey='permission:columns.id' />
    ),
    cell: ({ row }) => <span className='w-8'>#{row.getValue('id')}</span>,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        titleKey='permission:columns.name'
      />
    ),
    enableHiding: false,
    enableSorting: true,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        titleKey='permission:columns.createdAt'
      />
    ),
    enableHiding: false,
    enableSorting: true,
  },
  {
    id: 'actions',
    header: () => null,
    cell: ({ row }) => <PermissionTableRowActions row={row} />,
    enableSorting: false,
  },
]
