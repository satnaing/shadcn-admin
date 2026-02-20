import { type ColumnDef } from '@tanstack/react-table'
import { type Ingredient } from '@/types/inventory'
import { MoreHorizontal, SquarePen } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import { getTranslation } from '@/utils/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table'

export const columns = (
  onEdit: (ingredient: Ingredient) => void
): ColumnDef<Ingredient>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='min-w-[150px] font-medium'>
        {getTranslation(row.original.name)}
      </div>
    ),
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKU' />
    ),
    cell: ({ row }) => (
      <div className='w-[140px] truncate'>{row.original.sku || '-'}</div>
    ),
  },
  {
    accessorKey: 'unit',
    header: 'Base Unit',
    cell: ({ row }) => (
      <div className='w-[80px]'>
        {row.original.unit ? getTranslation(row.original.unit.symbol) : '-'}
      </div>
    ),
  },
  {
    accessorKey: 'cost',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Default Cost'
        className='justify-end'
      />
    ),
    cell: ({ row }) => (
      <div className='text-right font-medium'>
        {row.original.cost
          ? formatCurrency(row.original.cost, 'USD', 'en-US', {
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            })
          : '-'}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const ingredient = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onEdit(ingredient)}>
              <SquarePen className='mr-2 h-4 w-4' />
              <span>Edit</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
