import { formatDistanceToNow, differenceInHours } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTable } from '@/components/custom/data-table'
import { type Cart } from '../data/cart-schema'

interface ActiveCartsTableProps {
  data: Cart[]
  onViewDetails: (cart: Cart) => void
}

export function ActiveCartsTable({
  data,
  onViewDetails,
}: ActiveCartsTableProps) {
  const columns: ColumnDef<Cart>[] = [
    {
      accessorKey: 'user',
      header: 'Customer',
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>{user.fullName || 'Guest'}</span>
            <span className='text-xs text-muted-foreground'>{user.phone}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'items',
      header: 'Items',
      cell: ({ row }) => {
        const items = row.original.items
        const count = items.reduce((acc, item) => acc + item.quantity, 0)
        const summary = items.map((i) => i.productName).join(', ')

        return (
          <div className='max-w-[200px] truncate'>
            <span className='mr-2 font-semibold'>{count} items:</span>
            <span className='text-muted-foreground'>{summary}</span>
          </div>
        )
      },
    },
    {
      id: 'value',
      header: 'Value',
      cell: ({ row }) => {
        const total = row.original.items.reduce((sum, item) => {
          const optionsPrice =
            item.options?.reduce((oSum, opt) => oSum + (opt.price || 0), 0) || 0
          return sum + (item.unitPrice + optionsPrice) * item.quantity
        }, 0)

        return (
          <span className='font-medium'>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(total)}
          </span>
        )
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => {
        const date = row.original.updatedAt

        // Ensure date is valid before using date-fns
        if (!date || isNaN(date.getTime())) {
          return (
            <div className='flex items-center gap-2 text-muted-foreground'>
              <span>Unknown</span>
            </div>
          )
        }

        const isStale = differenceInHours(new Date(), date) >= 1

        return (
          <div className='flex items-center gap-2'>
            <span className={isStale ? 'font-medium text-destructive' : ''}>
              {formatDistanceToNow(date, { addSuffix: true })}
            </span>
            {isStale && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className='h-4 w-4 text-destructive' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Inactive for more than 1 hour</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onViewDetails(row.original)}
        >
          <Eye className='mr-2 h-4 w-4' />
          View
        </Button>
      ),
    },
  ]

  return <DataTable columns={columns} data={data} searchKey='user' />
}
