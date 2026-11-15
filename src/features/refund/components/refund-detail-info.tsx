import { useTranslation } from 'react-i18next'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { RefundDetail } from '../data/refund.type'
import { RefundBadge } from './refund-badge'

interface RowProps {
  label: string
  children: React.ReactNode
}

function Row({ label, children }: RowProps) {
  return (
    <div className='flex items-start justify-between gap-4 py-1.5 text-sm'>
      <dt className='text-muted-foreground'>{label}</dt>
      <dd className='text-end'>{children}</dd>
    </div>
  )
}

export function RefundImages({ images }: { images: string[] }) {
  return (
    <div className='flex flex-wrap gap-2'>
      {images.map((src) => (
        <a key={src} href={src} target='_blank' rel='noreferrer'>
          <img src={src} alt='' loading='lazy' width={80} height={80} className='size-20 rounded border object-cover' />
        </a>
      ))}
    </div>
  )
}

/** Everything the admin needs to decide: product, amount, who asked, why, payment channel and both decisions. */
export function RefundDetailInfo({ refund }: { refund: RefundDetail }) {
  const { t } = useTranslation('refund')
  const { formatMoney } = useCurrencyFormatter()
  const info = refund.payment_info

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-3'>
        <img src={refund.product_image} alt='' width={56} height={56} className='size-14 rounded border object-cover' />
        <div className='min-w-0'>
          <div className='font-medium'>{refund.product_name}</div>
          <div className='text-xs text-muted-foreground'>
            {refund.code} · #{refund.order_code}
          </div>
        </div>
      </div>
      <dl className='divide-y rounded-md border px-3'>
        <Row label={t('detail.amount')}>{formatMoney(refund.amount)}</Row>
        <Row label={t('detail.customer')}>{refund.customer_name}</Row>
        <Row label={t('detail.seller')}>{refund.seller_name}</Row>
        <Row label={t('detail.requestedAt')}>{refund.requested_at.slice(0, 16).replace('T', ' ')}</Row>
        <Row label={t('detail.channel')}>
          <RefundBadge group='channel' value={refund.payment_channel} />
        </Row>
        <Row label={t('columns.seller')}>
          <RefundBadge group='decision' value={refund.seller_decision} />
        </Row>
        <Row label={t('columns.admin')}>
          <RefundBadge group='decision' value={refund.admin_decision} />
        </Row>
        {refund.reject_reason && <Row label={t('detail.rejectReason')}>{refund.reject_reason}</Row>}
        {refund.transaction_id && <Row label={t('detail.transactionId')}>{refund.transaction_id}</Row>}
      </dl>
      <div>
        <div className='mb-1 text-sm font-medium'>{t('detail.reason')}</div>
        <p className='text-sm text-muted-foreground'>{refund.reason}</p>
      </div>
      {refund.images.length > 0 && <RefundImages images={refund.images} />}
      {info && (
        <div className='rounded-md border p-3 text-sm'>
          <div className='mb-1 font-medium'>{t('detail.paymentInfo')}</div>
          <div>{info.method}</div>
          <div className='text-muted-foreground'>
            {info.account_name} · {info.account_number}
          </div>
        </div>
      )}
    </div>
  )
}
