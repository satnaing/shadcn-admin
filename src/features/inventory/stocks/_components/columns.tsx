import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type ShopIngredient } from '@/types/inventory'
import { MoreHorizontal } from 'lucide-react'
import { getTranslation } from '@/utils/i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table'

interface ColumnsProps {
  onAdjust: (item: ShopIngredient) => void
  onEdit: (item: ShopIngredient) => void
}

export const getColumns = ({
  onAdjust,
  onEdit,
}: ColumnsProps): ColumnDef<ShopIngredient>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>
        {getTranslation(row.original.name) || 'Unknown Item'}
      </div>
    ),
  },
  {
    accessorKey: 'sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKU' />
    ),
    cell: ({ row }) => <div>{row.original.sku || '-'}</div>,
  },
  {
    accessorKey: 'currentStock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock' />
    ),
    cell: ({ row }) => {
      const quantity = row.getValue('currentStock') as number
      const unit = row.original.unitSymbol

      return (
        <div className='font-medium'>
          {quantity}{' '}
          <span className='rounded bg-muted px-2 py-1 font-mono text-xs'>
            {getTranslation(unit)}
          </span>
        </div>
      )
    },
  },
  {
    id: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const currentStock = row.original.currentStock
      const lowStockThreshold = row.original.lowStockThreshold
      const isLowStock = currentStock <= lowStockThreshold

      return (
        <Badge variant={isLowStock ? 'destructive' : 'outline'}>
          {isLowStock ? 'Low Stock' : 'Good'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'lastRestockedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Last Restocked' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('lastRestockedAt') as string
      if (!date) return <span className='text-muted-foreground'>-</span>
      return <div>{format(new Date(date), 'PP')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
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
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(row.original.shopIngredientId)
              }
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAdjust(row.original)}>
              Adjust Stock
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem>View History</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
