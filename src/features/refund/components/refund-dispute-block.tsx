import { useTranslation } from 'react-i18next'
import type { DisputeInfo } from '../data/refund.type'
import { RefundBadge } from './refund-badge'
import { RefundImages } from './refund-detail-info'

/** The customer's second attempt after a rejection: reason, photos and the admin's verdict on it. */
export function RefundDisputeBlock({ dispute }: { dispute: DisputeInfo }) {
  const { t } = useTranslation('refund')

  return (
    <section className='space-y-2 rounded-md border border-dashed p-3'>
      <div className='flex items-center justify-between'>
        <h4 className='font-medium'>{t('detail.dispute')}</h4>
        <RefundBadge group='status' value={dispute.status} />
      </div>
      <p className='text-sm text-muted-foreground'>{dispute.reason}</p>
      {dispute.images.length > 0 && <RefundImages images={dispute.images} />}
      {dispute.reject_reason && (
        <p className='text-sm'>
          <span className='text-muted-foreground'>{t('detail.rejectReason')}: </span>
          {dispute.reject_reason}
        </p>
      )}
      {dispute.transaction_id && (
        <p className='text-sm'>
          <span className='text-muted-foreground'>{t('detail.transactionId')}: </span>
          {dispute.transaction_id}
        </p>
      )}
    </section>
  )
}
