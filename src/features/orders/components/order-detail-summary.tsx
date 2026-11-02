import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { type OrderItem } from '../data/orders.type'
import {
  OrderDeliveryStatusBadge,
  OrderPaymentStatusBadge,
} from './order-status-badge'

interface OrderDetailSummaryProps {
  order: OrderItem
}

export function OrderDetailSummary({ order }: OrderDetailSummaryProps) {
  const { t } = useTranslation('orders')

  return (
    <div className='grid gap-4 md:grid-cols-3'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-semibold'>{t('detail.customer', 'Müştəri Məlumatı')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-1 text-sm'>
          <div className='font-medium'>{order.customer_name}</div>
          <div className='text-muted-foreground'>{order.customer_email}</div>
          <div className='text-muted-foreground'>{order.customer_phone}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-semibold'>
            {order.shipping_type === 'pickup_point'
              ? t('detail.pickupPoint', 'Təhvil Məntəqəsi')
              : t('detail.shippingAddress', 'Çatdırılma Ünvanı')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-1 text-sm'>
          {order.pickup_point_name ? (
            <div className='font-medium text-primary'>{order.pickup_point_name}</div>
          ) : null}
          <div>{order.shipping_address.address}</div>
          <div className='text-muted-foreground'>
            {order.shipping_address.city}, {order.shipping_address.country}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm font-semibold'>{t('detail.statusInfo', 'Status və Ödəniş')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2 text-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>{t('table.deliveryStatus', 'Çatdırılma')}:</span>
            <OrderDeliveryStatusBadge status={order.delivery_status} />
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>{t('table.paymentStatus', 'Ödəniş')}:</span>
            <OrderPaymentStatusBadge status={order.payment_status} />
          </div>
          <div className='flex items-center justify-between text-xs text-muted-foreground'>
            <span>{t('table.paymentMethod', 'Metod')}:</span>
            <span className='font-medium text-foreground'>{order.payment_type}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function OrderPriceBreakdown({ order }: OrderDetailSummaryProps) {
  const { t } = useTranslation('orders')

  return (
    <Card className='ml-auto max-w-sm'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-semibold'>{t('detail.orderSummary', 'Məbləğ Detalları')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{t('detail.subtotal', 'Ara Cəm')}:</span>
          <span>{order.subtotal.toFixed(2)} ₼</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{t('detail.tax', 'ƏDV / Vergi')}:</span>
          <span>{order.tax_amount.toFixed(2)} ₼</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>{t('detail.shippingCost', 'Çatdırılma Haqqı')}:</span>
          <span>{order.shipping_cost.toFixed(2)} ₼</span>
        </div>
        {order.coupon_discount > 0 && (
          <div className='flex justify-between text-emerald-600'>
            <span>{t('detail.couponDiscount', 'Kupon Endirimi')}:</span>
            <span>-{order.coupon_discount.toFixed(2)} ₼</span>
          </div>
        )}
        <Separator className='my-2' />
        <div className='flex justify-between text-base font-bold'>
          <span>{t('detail.grandTotal', 'Yekun Məbləğ')}:</span>
          <span className='text-primary'>{order.grand_total.toFixed(2)} ₼</span>
        </div>
      </CardContent>
    </Card>
  )
}
