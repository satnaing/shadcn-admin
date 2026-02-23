import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type Order } from '@/types/api'
import { ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'invoiceCode',
    header: 'Invoice',
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('invoiceCode')}</span>
    ),
  },
  {
    accessorKey: 'queueNumber',
    header: 'Queue',
    cell: ({ row }) => (
      <Badge variant='outline'>{row.getValue('queueNumber')}</Badge>
    ),
  },
  {
    accessorKey: 'fulfillment.category',
    header: 'Type',
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground capitalize'>
        {String(row.original.fulfillment?.category || 'N/A')
          .toLowerCase()
          .replace('_', ' ')}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.customer?.name || 'Guest',
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => row.getValue('customer'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      let colorClass = 'bg-secondary text-secondary-foreground'

      if (status === 'COMPLETED') colorClass = 'bg-slate-100 text-slate-700'
      else if (status === 'READY') colorClass = 'bg-green-100 text-green-700'
      else if (status === 'CANCELLED') colorClass = 'bg-red-100 text-red-700'
      else if (status === 'CONFIRMED') colorClass = 'bg-blue-100 text-blue-700'

      return (
        <Badge
          variant='secondary'
          className={`${colorClass} hover:${colorClass}`}
        >
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorFn: (row) => row.pricing?.grandTotal || 0,
    id: 'grandTotal',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('grandTotal'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return <div className='ml-4 font-medium'>{formatted}</div>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      const dateVal = row.getValue('createdAt') as string | undefined
      if (!dateVal) return <span className='text-muted-foreground'>-</span>

      try {
        return (
          <span className='whitespace-nowrap text-muted-foreground'>
            {format(new Date(dateVal), 'MMM d, h:mm a')}
          </span>
        )
      } catch (_e) {
        return <span className='text-muted-foreground'>Invalid Date</span>
      }
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        onViewDetails: (order: Order) => void
      }
      return (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => meta.onViewDetails(row.original)}
        >
          View Details
        </Button>
      )
    },
  },
]
