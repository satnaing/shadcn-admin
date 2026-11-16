import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OrderDetail } from '../data/preorder.type'
import { OwnerBadge } from './preorder-badge'

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='flex justify-between gap-4 py-1 text-sm'>
      <span className='text-muted-foreground'>{label}</span>
      <span className='text-end font-medium'>{value || '—'}</span>
    </div>
  )
}

/** Product, customer and price summary of one preorder. */
export function PreorderOrderInfo({ order }: { order: OrderDetail }) {
  const { t } = useTranslation('preorder')
  const { formatMoney } = useCurrencyFormatter()
  const money = (key: string, value: number) => (
    <Row key={key} label={t(`detail.${key}`)} value={formatMoney(value)} />
  )

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>{t('detail.product')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='mb-3 flex items-center gap-3'>
            <img
              src={order.product_image}
              alt=''
              width={56}
              height={56}
              className='size-14 rounded border object-cover'
            />
            <div>
              <div className='font-medium'>{order.product_name}</div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <OwnerBadge type={order.owner_type} /> {order.owner_name}
              </div>
            </div>
          </div>
          <Row label={t('detail.quantity')} value={order.quantity} />
          <Row label={t('detail.requestNote')} value={order.request_note} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>{t('detail.customer')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Row label={t('detail.name')} value={order.customer_name} />
          <Row label={t('detail.email')} value={order.customer_email} />
          <Row label={t('detail.phone')} value={order.customer_phone} />
          <Row label={t('detail.address')} value={order.address} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>{t('detail.summary')}</CardTitle>
        </CardHeader>
        <CardContent>
          {money('unitPrice', order.unit_price)}
          {money('subtotal', order.subtotal)}
          {money('tax', order.tax)}
          {money('shipping', order.shipping_cost)}
          {money('couponDiscount', order.coupon_discount)}
          {money('deposit', order.prepayment_amount)}
          <div className='mt-2 border-t pt-2'>
            {money('grandTotal', order.grand_total)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
