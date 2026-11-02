import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { RoleTableRowActions } from '@/features/role/components/role-table-row-actions.tsx'
import { type RoleEntityInterface } from '@/features/role/data/role.type.ts'

export const roleColumns: ColumnDef<RoleEntityInterface>[] = [
  {
    accessorKey: 'id',
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} titleKey='role:columns.id' />
    ),
    cell: ({ row }) => <span className='w-8'>#{row.getValue('id')}</span>,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} titleKey='role:columns.name' />
    ),
    enableHiding: false,
    enableSorting: true,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        titleKey='role:columns.createdAt'
      />
    ),
    enableHiding: false,
    enableSorting: true,
  },
  {
    id: 'actions',
    header: () => null,
    cell: ({ row }) => <RoleTableRowActions row={row} />,
    enableSorting: false,
  },
]
