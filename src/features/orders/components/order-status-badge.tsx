import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import {
  type DeliveryStatus,
  type PaymentStatus,
} from '../data/orders.type'

interface DeliveryBadgeProps {
  status: DeliveryStatus
}

export function OrderDeliveryStatusBadge({ status }: DeliveryBadgeProps) {
  const { t } = useTranslation('orders')

  switch (status) {
    case 'pending':
      return (
        <Badge variant='warning'>
          {t('status.pending', 'Gözləmədə')}
        </Badge>
      )
    case 'confirmed':
      return (
        <Badge variant='outline' className='border-sky-500/50 bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400'>
          {t('status.confirmed', 'Təsdiqləndi')}
        </Badge>
      )
    case 'picked_up':
      return (
        <Badge variant='outline' className='border-indigo-500/50 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400'>
          {t('status.picked_up', 'Kuryerə verildi')}
        </Badge>
      )
    case 'on_the_way':
      return (
        <Badge variant='default'>
          {t('status.on_the_way', 'Yoldadır')}
        </Badge>
      )
    case 'delivered':
      return (
        <Badge variant='success'>
          {t('status.delivered', 'Çatdırıldı')}
        </Badge>
      )
    case 'cancelled':
      return (
        <Badge variant='destructive'>
          {t('status.cancelled', 'Ləğv edildi')}
        </Badge>
      )
    default:
      return <Badge variant='outline'>{status}</Badge>
  }
}

interface PaymentBadgeProps {
  status: PaymentStatus
}

export function OrderPaymentStatusBadge({ status }: PaymentBadgeProps) {
  const { t } = useTranslation('orders')

  if (status === 'paid') {
    return (
      <Badge variant='success'>
        {t('payment.paid', 'Ödənilib')}
      </Badge>
    )
  }

  return (
    <Badge variant='destructive'>
      {t('payment.unpaid', 'Ödənilməyib')}
    </Badge>
  )
}
