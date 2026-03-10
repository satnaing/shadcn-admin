import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TopProductItem {
  name: string
  quantity: number
  revenue: number
}

interface TopProductsProps {
  data: TopProductItem[]
}

export function ShopLeaderboard({ data }: TopProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className='text-right'>Qty Sold</TableHead>
            <TableHead className='text-right'>Net Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((product, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{product.name}</TableCell>
                <TableCell className='text-right'>{product.quantity}</TableCell>
                <TableCell className='text-right'>
                  {formatCurrency(product.revenue)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className='h-24 text-center'>
                No sales data available yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
