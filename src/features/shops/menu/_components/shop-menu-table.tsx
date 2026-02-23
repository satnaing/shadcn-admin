import { type ColumnDef } from '@tanstack/react-table'
import { type ShopProduct } from '@/types/api'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/custom/data-table'
import { PriceCell, AvailabilityCell } from './shop-menu-cells'

const getColumns = (shopId: string): ColumnDef<ShopProduct>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'product.name.en',
    header: 'Product',
    cell: ({ row }) => {
      const name = row.original.product?.name?.en || 'Unknown'
      return (
        <div className='flex flex-col'>
          <span className='font-medium'>{name}</span>
        </div>
      )
    },
  },
  {
    id: 'categoryId',
    accessorFn: (row) => row.product?.categoryId,
    header: 'Category',
    cell: ({ row }) => {
      const categoryName =
        row.original.product?.category?.name?.en || 'Uncategorized'
      return <span>{categoryName}</span>
    },
  },
  {
    accessorKey: 'isAvailable',
    header: 'Availability',
    cell: ({ row }) => <AvailabilityCell row={row} shopId={shopId} />,
  },
  {
    accessorKey: 'price',
    header: 'Price Override',
    cell: ({ row }) => <PriceCell row={row} shopId={shopId} />,
  },
]

interface ShopMenuTableProps {
  shopId: string
  data: ShopProduct[]
  categories?: any[]
}

export function ShopMenuTable({
  shopId,
  data,
  categories,
}: ShopMenuTableProps) {
  const categoryFilters =
    categories?.map((category) => ({
      label: category.name?.en || 'Unknown Category',
      value: category.id,
    })) || []

  return (
    <div className='flex flex-col space-y-4'>
      <DataTable
        columns={getColumns(shopId)}
        data={data}
        searchKey='product.name.en' // Need dot notation search support or a custom filter
        searchPlaceholder='Filter products...'
        filters={[
          {
            columnId: 'categoryId', // Using a hidden column for filtering
            title: 'Category',
            options: categoryFilters,
          },
        ]}
      />
    </div>
  )
}
