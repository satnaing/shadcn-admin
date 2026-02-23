import { type ColumnDef } from '@tanstack/react-table'
import type { SurchargeConfig } from '@/types/api'
import { Edit, MoreHorizontal, Power, PowerOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table'

interface TableMeta {
  onEdit: (surcharge: SurchargeConfig) => void
  onToggle: (surcharge: SurchargeConfig) => void
}

export const columns: ColumnDef<SurchargeConfig>[] = [
  {
    accessorKey: 'name.en',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => <Badge variant='outline'>{row.original.type}</Badge>,
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      const val = row.original.value
      const type = row.original.type
      return type === 'PERCENTAGE' ? `${val}%` : `$${val}`
    },
  },
  {
    id: 'isTax',
    header: 'Tax',
    cell: ({ row }) => {
      return row.original.isTax ? <Badge variant='outline'>Tax</Badge> : null
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const active = row.original.isActive
      return (
        <Badge variant={active ? 'default' : 'secondary'}>
          {active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const surcharge = row.original
      const meta = table.options.meta as TableMeta

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => meta?.onEdit(surcharge)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onToggle(surcharge)}>
              {surcharge.isActive ? (
                <>
                  <PowerOff className='mr-2 h-4 w-4' />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className='mr-2 h-4 w-4' />
                  Activate
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
