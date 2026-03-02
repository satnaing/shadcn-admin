import { type ShopIngredient } from '@/types/inventory'
import { DataTable } from '@/components/custom/data-table'
import { getColumns } from './columns'

interface InventoryTableProps {
  data: ShopIngredient[]
  onAdjust: (item: ShopIngredient) => void
  onEdit: (item: ShopIngredient) => void
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

export function InventoryTable({
  data,
  onAdjust,
  onEdit,
  pageCount,
  pagination,
  onPaginationChange,
}: InventoryTableProps) {
  const columns = getColumns({ onAdjust, onEdit })

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='ingredient.name'
      searchPlaceholder='Filter ingredients...'
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
    />
  )
}
