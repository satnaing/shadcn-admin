import { type Order } from '@/types/api'
import { DataTable } from '@/components/custom/data-table'
import { columns } from './order-history-columns'

interface OrderHistoryTableProps {
  data: Order[]
  onRowClick: (order: Order) => void
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

export function OrderHistoryTable({
  data,
  onRowClick,
  pageCount,
  pagination,
  onPaginationChange,
}: OrderHistoryTableProps) {
  return (
    <div className='cursor-pointer'>
      <DataTable
        data={data}
        columns={columns}
        searchKey='invoiceCode'
        searchPlaceholder='Search invoice #...'
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        // Passing onRowClick via meta to the columns/cells if needed,
        // OR better: use the Action column to trigger the View
        meta={{ onViewDetails: onRowClick }}
      />
    </div>
  )
}
