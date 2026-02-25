import { type Product } from '@/types/api'
import { DataTable } from '@/components/custom/data-table'
// Removed Category import
import { getColumns, type ProductActions } from './products-columns'

interface ProductsTableProps extends Partial<ProductActions> {
  data: Product[]
  categories?: any[]
}

export function ProductsTable({
  data,
  categories,
  onEdit = () => {},
  onDelete = () => {},
}: ProductsTableProps) {
  const columns = getColumns({ onEdit, onDelete, categories: categories || [] })

  return (
    <DataTable
      columns={columns}
      data={data as unknown as any[]}
      searchKey='name'
      searchPlaceholder='Filter products...'
    />
  )
}
