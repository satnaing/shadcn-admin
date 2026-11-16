import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { buildOrderPayload, checkoutBlocker } from '../data/pos-payload'
import { guestSchema } from '../data/pos.schema'
import type { PosGuestInfo, PosOfflinePayment, PosPaymentType } from '../data/pos.type'
import { usePosSettings } from '../hooks/use-pos'
import { usePosCart } from '../hooks/use-pos-cart'
import { usePosCustomer } from '../hooks/use-pos-customer'
import { usePosMutations } from '../hooks/use-pos-mutations'
import { PosCartPanel } from './pos-cart-panel'
import { PosCustomerPanel } from './pos-customer-panel'
import { PosProductGrid } from './pos-product-grid'
import { PosSummaryDialog } from './pos-summary-dialog'

type GuestErrors = Partial<Record<keyof PosGuestInfo, string>>

/** The terminal: catalogue on the left, customer + cart on the right, summary dialog to pay. */
export function PosTerminalPage() {
  const { t } = useTranslation('pos')
  const cart = usePosCart()
  const customer = usePosCustomer()
  const { placeOrder, receipt } = usePosMutations()
  const printWidth = usePosSettings().data?.data.print_width
  const [summary, setSummary] = useState(false)
  const [guestErrors, setGuestErrors] = useState<GuestErrors>({})

  const checkout = () => {
    const blocker = checkoutBlocker({
      source: customer.source,
      customerId: customer.customer?.id ?? null,
      addressId: customer.addressId,
      lines: cart.lines,
    })
    if (blocker) return void toast.error(t(`checkout.${blocker}`))
    if (customer.source !== 'registered') {
      const parsed = guestSchema.safeParse(customer.guest)
      const errors: GuestErrors = {}
      if (!parsed.success)
        for (const issue of parsed.error.issues)
          errors[issue.path[0] as keyof PosGuestInfo] ??= issue.message
      setGuestErrors(errors)
      if (!parsed.success) return
    }
    setSummary(true)
  }

  const printReceipt = (orderId: number) =>
    printWidth ? receipt.mutate(orderId) : toast.warning(t('checkout.noWidth'))

  const pay = (paymentType: PosPaymentType, offline?: PosOfflinePayment) =>
    placeOrder.mutate(
      buildOrderPayload({
        ...customer,
        customerId: customer.customer?.id ?? null,
        lines: cart.lines,
        shipping: cart.shipping,
        discount: cart.discount,
        paymentType,
        offline: offline ?? null,
      }),
      {
        onSuccess: ({ data }) => {
          toast.success(t('checkout.placed', { code: data.code }), {
            action: { label: t('checkout.print'), onClick: () => printReceipt(data.id) },
          })
          cart.clear()
          customer.reset()
          setSummary(false)
        },
      }
    )

  return (
    <AdminPageShell title={t('terminal.title')} description={t('terminal.description')}>
      <div className='grid gap-4 xl:grid-cols-[1fr_26rem]'>
        <PosProductGrid onAdd={cart.add} />
        <div className='space-y-4'>
          <PosCustomerPanel state={customer} guestErrors={guestErrors} />
          <PosCartPanel cart={cart} onCheckout={checkout} />
        </div>
      </div>
      <PosSummaryDialog
        open={summary}
        onOpenChange={setSummary}
        cart={cart}
        customerLabel={customer.customer?.name ?? t(`source.${customer.source}`)}
        pending={placeOrder.isPending}
        onPay={pay}
      />
    </AdminPageShell>
  )
}
