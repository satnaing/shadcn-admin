import { useState } from 'react'
import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PermissionGuard } from '@/components/guard'
import { canSetStep } from '../data/preorder.helpers'
import {
  ORDER_STEPS,
  type OrderDetail,
  type OrderStep,
} from '../data/preorder.type'
import { StepBadge } from './preorder-badge'
import { PreorderStepDialog } from './preorder-step-dialog'

/** The preorder workflow: request → deposit → final order → shipping → delivery → refund; each step needs the previous one accepted. */
export function PreorderOrderSteps({ order }: { order: OrderDetail }) {
  const { t } = useTranslation('preorder')
  const [pick, setPick] = useState<{
    step: OrderStep
    status: 'accepted' | 'denied'
  } | null>(null)
  // deposit is skipped for products without one; refund exists only for refundable, delivered orders
  const steps = ORDER_STEPS.filter(
    (s) =>
      (s !== 'prepayment' || order.is_prepayment) &&
      (s !== 'refund' || order.is_refundable)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{t('detail.workflow')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {steps.map((step, i) => (
          <div
            key={step}
            className='flex flex-wrap items-start justify-between gap-3 border-b pb-3 last:border-0'
          >
            <div className='space-y-1'>
              <div className='font-medium'>
                {i + 1}. {t(`step.${step}`)}
              </div>
              <StepBadge status={order.steps[step]} />
              {order.step_at[step] && (
                <div className='text-xs text-muted-foreground'>
                  {order.step_at[step]?.slice(0, 16).replace('T', ' ')}
                </div>
              )}
              {order.step_notes[step] && (
                <p className='text-sm'>{order.step_notes[step]}</p>
              )}
              {step === 'shipping' && order.shipping_proof && (
                <a
                  className='text-sm text-primary underline'
                  href={order.shipping_proof}
                  target='_blank'
                  rel='noreferrer'
                >
                  {t('detail.proof')}
                </a>
              )}
            </div>
            <PermissionGuard permission={PERMISSIONS.PREORDER.ORDERS_MANAGE}>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  disabled={!canSetStep(order.steps, step)}
                  onClick={() => setPick({ step, status: 'accepted' })}
                >
                  {t('actions.accept')}
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={!canSetStep(order.steps, step)}
                  onClick={() => setPick({ step, status: 'denied' })}
                >
                  {t('actions.deny')}
                </Button>
              </div>
            </PermissionGuard>
          </div>
        ))}
        {pick && (
          <PreorderStepDialog
            key={`${pick.step}-${pick.status}`}
            orderId={order.id}
            step={pick.step}
            status={pick.status}
            onClose={() => setPick(null)}
          />
        )}
      </CardContent>
    </Card>
  )
}
