import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PERMISSIONS } from '@/shared/permissions'
import type { RefundKind } from '../data/refund.type'
import { useRefundDetail } from '../hooks/use-refund'
import { RefundDetailInfo } from './refund-detail-info'
import { RefundDisputeBlock } from './refund-dispute-block'
import { RefundPayDialog } from './refund-pay-dialog'
import { RefundRejectDialog } from './refund-reject-dialog'

interface Props {
  id: number | null
  kind: RefundKind
  onClose: () => void
}

type Step = 'pay' | 'reject' | null

export function RefundDetailDialog({ id, kind, onClose }: Props) {
  const { t } = useTranslation('refund')
  const [step, setStep] = useState<Step>(null)
  const { data } = useRefundDetail(id ?? undefined)
  const refund = id ? data?.data : undefined
  const pending = kind === 'dispute' ? refund?.dispute?.status === 'pending' : refund?.status === 'pending'
  const manage = kind === 'dispute' ? PERMISSIONS.REFUND.DISPUTES_MANAGE : PERMISSIONS.REFUND.REQUESTS_MANAGE

  return (
    <>
      <Dialog open={id !== null} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader className='text-start'>
            <DialogTitle>{t('detail.title')}</DialogTitle>
            <DialogDescription>{refund?.code ?? t('detail.loading')}</DialogDescription>
          </DialogHeader>
          {refund ? (
            <div className='max-h-[65vh] space-y-4 overflow-y-auto pe-1'>
              <RefundDetailInfo refund={refund} />
              {refund.dispute && <RefundDisputeBlock dispute={refund.dispute} />}
            </div>
          ) : (
            <div aria-busy='true' className='h-40' />
          )}
          {pending && (
            <PermissionGuard permission={manage}>
              <DialogFooter>
                <Button variant='destructive' onClick={() => setStep('reject')}>
                  {t('actions.reject')}
                </Button>
                <Button onClick={() => setStep('pay')}>{t('actions.refundNow')}</Button>
              </DialogFooter>
            </PermissionGuard>
          )}
        </DialogContent>
      </Dialog>
      {refund && (
        <>
          <RefundPayDialog open={step === 'pay'} onOpenChange={() => setStep(null)} refund={refund} kind={kind} onDone={onClose} />
          <RefundRejectDialog open={step === 'reject'} onOpenChange={() => setStep(null)} refund={refund} kind={kind} onDone={onClose} />
        </>
      )}
    </>
  )
}
