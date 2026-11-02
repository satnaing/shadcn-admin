import { Eye, Settings2, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type OrderItem } from '../data/orders.type'
import {
  OrderDeliveryStatusBadge,
  OrderPaymentStatusBadge,
} from './order-status-badge'

interface OrdersTableProps {
  orders: OrderItem[]
  isLoading?: boolean
  onManage: (order: OrderItem) => void
  onDelete: (id: number) => void
}

export function OrdersTable({
  orders,
  isLoading,
  onManage,
  onDelete,
}: OrdersTableProps) {
  const { t } = useTranslation('orders')

  if (isLoading) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('loading', 'Yüklənir...')}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('noOrders', 'Heç bir sifariş tapılmadı')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[130px]'>{t('table.code', 'Sifariş Kodu')}</TableHead>
            <TableHead>{t('table.items', 'Məhsul Sayı')}</TableHead>
            <TableHead>{t('table.customer', 'Müştəri')}</TableHead>
            <TableHead>{t('table.seller', 'Satıcı')}</TableHead>
            <TableHead>{t('table.amount', 'Məbləğ')}</TableHead>
            <TableHead>{t('table.deliveryStatus', 'Çatdırılma Statusu')}</TableHead>
            <TableHead>{t('table.paymentMethod', 'Ödəniş Metodu')}</TableHead>
            <TableHead>{t('table.paymentStatus', 'Ödəniş Statusu')}</TableHead>
            <TableHead className='text-right'>{t('table.options', 'Əməliyyatlar')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className='font-semibold'>
                <Link
                  to='/admin/orders/$id'
                  params={{ id: String(order.id) }}
                  className='text-primary hover:underline'
                >
                  #{order.code}
                </Link>
                <div className='text-xs text-muted-foreground'>{order.date}</div>
              </TableCell>
              <TableCell>{order.items_count} ədəd</TableCell>
              <TableCell>
                <div className='font-medium'>{order.customer_name}</div>
                <div className='text-xs text-muted-foreground'>{order.customer_phone}</div>
              </TableCell>
              <TableCell>
                <span className={order.seller_id ? 'text-foreground' : 'text-primary font-medium'}>
                  {order.seller_name}
                </span>
              </TableCell>
              <TableCell className='font-semibold'>
                {order.grand_total.toFixed(2)} ₼
              </TableCell>
              <TableCell>
                <OrderDeliveryStatusBadge status={order.delivery_status} />
              </TableCell>
              <TableCell>
                <div className='text-sm'>{order.payment_type}</div>
              </TableCell>
              <TableCell>
                <OrderPaymentStatusBadge status={order.payment_status} />
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-1'>
                  <Button variant='ghost' size='icon' asChild>
                    <Link to='/admin/orders/$id' params={{ id: String(order.id) }}>
                      <Eye className='size-4' />
                    </Link>
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onManage(order)}
                    title={t('dialog.title', 'Statusu dəyiş')}
                  >
                    <Settings2 className='size-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-destructive hover:bg-destructive/10'
                    onClick={() => onDelete(order.id)}
                    title={t('delete', 'Sil')}
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
