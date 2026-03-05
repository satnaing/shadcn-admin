import { type ColumnDef } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/data-table'
import { type UserLoyaltyBalance } from '../../data/loyalty-schema'

interface CustomerBalanceTableProps {
  data: UserLoyaltyBalance[]
  onAdjust: (user: UserLoyaltyBalance) => void
  pageCount?: number
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange?: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void
}

export function CustomerBalanceTable({
  data,
  onAdjust,
  pageCount,
  pagination,
  onPaginationChange,
}: CustomerBalanceTableProps) {
  const columns: ColumnDef<UserLoyaltyBalance>[] = [
    {
      accessorKey: 'userName',
      header: 'Customer',
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <span className='font-medium'>{row.original.userName}</span>
          <span className='text-xs text-muted-foreground'>
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'currentPoints',
      header: 'Current Points',
      cell: ({ row }) => (
        <div className='font-mono font-medium'>
          {row.original.currentPoints.toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: 'lifetimePoints',
      header: 'Lifetime Earned',
      cell: ({ row }) => (
        <div className='text-muted-foreground'>
          {row.original.lifetimePoints.toLocaleString()}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onAdjust(row.original)}
        >
          <Settings2 className='mr-2 h-4 w-4' />
          Adjust
        </Button>
      ),
    },
  ]

  return (
    <div className='rounded-md border'>
      <DataTable
        columns={columns}
        data={data}
        searchKey='userName'
        searchPlaceholder='Search customers...'
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
      />
    </div>
  )
}
