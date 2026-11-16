import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { PosOfflinePayment, PosPaymentType } from '../data/pos.type'
import type { PosCart } from '../hooks/use-pos-cart'
import { PosOfflineForm } from './pos-offline-form'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: PosCart
  /** Customer name, or the order source label for anonymous orders. */
  customerLabel: string
  pending: boolean
  onPay: (type: PosPaymentType, offline?: PosOfflinePayment) => void
}

/** Order summary (AEC `order-confirm`) with the three payment buttons; "Offline" asks for payment info first. */
export function PosSummaryDialog({
  open,
  onOpenChange,
  cart,
  customerLabel,
  pending,
  onPay,
}: Props) {
  const { t } = useTranslation('pos')
  const { formatMoney } = useCurrencyFormatter()
  const [offline, setOffline] = useState(false)
  const { totals } = cart
  const close = (next: boolean) => {
    if (!next) setOffline(false)
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('summary.title')}</DialogTitle>
          <DialogDescription>{customerLabel}</DialogDescription>
        </DialogHeader>
        <ul className='divide-y text-sm'>
          {cart.lines.map(({ stock, quantity }) => (
            <li key={stock.id} className='flex justify-between gap-3 py-1.5'>
              <span className='truncate'>
                {stock.name}
                {stock.variant && ` (${stock.variant})`} × {quantity}
              </span>
              <span>{formatMoney(stock.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <p className='flex justify-between border-t pt-2 text-base font-semibold'>
          <span>{t('cart.total')}</span>
          <span>{formatMoney(totals.total)}</span>
        </p>
        {offline ? (
          <PosOfflineForm
            total={totals.total}
            pending={pending}
            onBack={() => setOffline(false)}
            onConfirm={(payment) => onPay('offline_payment', payment)}
          />
        ) : (
          <div className='grid grid-cols-3 gap-2'>
            <Button type='button' variant='outline' disabled={pending} onClick={() => setOffline(true)}>
              {t('summary.offline')}
            </Button>
            <Button type='button' variant='outline' disabled={pending} onClick={() => onPay('cash_on_delivery')}>
              {t('summary.cod')}
            </Button>
            <Button type='button' disabled={pending} onClick={() => onPay('cash')}>
              {t('summary.cash')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
