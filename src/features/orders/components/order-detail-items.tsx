import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type OrderItemProduct } from '../data/orders.type'

interface OrderDetailItemsProps {
  items: OrderItemProduct[]
}

export function OrderDetailItems({ items }: OrderDetailItemsProps) {
  const { t } = useTranslation('orders')

  return (
    <div className='rounded-lg border bg-card'>
      <div className='border-b p-4'>
        <h2 className='font-semibold'>{t('detail.orderedItems', 'Sifariş Edilən Məhsullar')}</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[60px]'>#</TableHead>
            <TableHead>{t('detail.product', 'Məhsul')}</TableHead>
            <TableHead>{t('detail.variation', 'Variant')}</TableHead>
            <TableHead className='text-center'>{t('detail.quantity', 'Say')}</TableHead>
            <TableHead className='text-right'>{t('detail.unitPrice', 'Vahid Qiyməti')}</TableHead>
            <TableHead className='text-right'>{t('detail.total', 'Cəmi')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell className='text-muted-foreground'>{idx + 1}</TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {item.product_thumbnail && (
                    <img
                      src={item.product_thumbnail}
                      alt={item.product_name}
                      className='size-10 rounded object-cover'
                    />
                  )}
                  <div className='font-medium'>{item.product_name}</div>
                </div>
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {item.variation ?? '—'}
              </TableCell>
              <TableCell className='text-center font-medium'>{item.quantity}</TableCell>
              <TableCell className='text-right'>{item.unit_price.toFixed(2)} ₼</TableCell>
              <TableCell className='text-right font-semibold'>{item.total.toFixed(2)} ₼</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
