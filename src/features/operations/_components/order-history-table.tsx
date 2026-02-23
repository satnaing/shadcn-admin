import { type Order } from '@/types/api'
import { DataTable } from '@/components/custom/data-table'
import { columns } from './order-history-columns'

interface OrderHistoryTableProps {
  data: Order[]
  onRowClick: (order: Order) => void
}

export function OrderHistoryTable({
  data,
  onRowClick,
}: OrderHistoryTableProps) {
  return (
    <div className='cursor-pointer'>
      <DataTable
        data={data}
        columns={columns}
        searchKey='invoiceCode'
        searchPlaceholder='Search invoice #...'
        // Passing onRowClick via meta to the columns/cells if needed,
        // OR better: use the Action column to trigger the View
        meta={{ onViewDetails: onRowClick }}
      />
    </div>
  )
}
