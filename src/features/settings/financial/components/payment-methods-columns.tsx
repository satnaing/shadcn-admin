import { type ColumnDef } from '@tanstack/react-table'
import type { PaymentMethod } from '@/types/api'
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
  onEdit: (paymentMethod: PaymentMethod) => void
  onToggle: (paymentMethod: PaymentMethod) => void
}

export const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: 'logoUrl',
    header: 'Logo',
    cell: ({ row }) => {
      const logoUrl = row.original.logoUrl
      return logoUrl ? (
        <img
          src={logoUrl}
          alt={row.original.name.en}
          className='h-8 w-8 rounded-md border object-contain'
        />
      ) : (
        <div className='flex h-8 w-8 items-center justify-center rounded-md border bg-muted text-[10px] text-muted-foreground'>
          No Logo
        </div>
      )
    },
  },
  {
    accessorKey: 'name.en',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    cell: ({ row }) => <Badge variant='outline'>{row.original.category}</Badge>,
  },
  {
    accessorKey: 'isDigital',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant='secondary'>
        {row.original.isDigital ? 'Digital' : 'Physical'}
      </Badge>
    ),
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
      const paymentMethod = row.original
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
            <DropdownMenuItem onClick={() => meta?.onEdit(paymentMethod)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onToggle(paymentMethod)}>
              {paymentMethod.isActive ? (
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
