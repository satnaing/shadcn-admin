import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  type DeliveryStatus,
  type OrderItem,
  type PaymentStatus,
} from '../data/orders.type'
import { useOrderMutations } from '../hooks/useOrders'

interface ManageOrderFormProps {
  order: OrderItem
  onClose: () => void
}

function ManageOrderForm({ order, onClose }: ManageOrderFormProps) {
  const { t } = useTranslation('orders')
  const { deliveryMutation, paymentMutation } = useOrderMutations()
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(order.delivery_status)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.payment_status)

  const handleSave = async () => {
    try {
      if (deliveryStatus !== order.delivery_status) {
        await deliveryMutation.mutateAsync({ id: order.id, status: deliveryStatus })
      }
      if (paymentStatus !== order.payment_status) {
        await paymentMutation.mutateAsync({ id: order.id, status: paymentStatus })
      }
      toast.success(t('dialog.success', 'Sifariş statusu uğurla yeniləndi!'))
      onClose()
    } catch {
      toast.error(t('dialog.error', 'Status yenilənərkən xəta baş verdi'))
    }
  }

  const isPending = deliveryMutation.isPending || paymentMutation.isPending

  return (
    <>
      <div className='grid gap-4 py-4'>
        <div className='grid gap-2'>
          <Label>{t('dialog.deliveryStatusLabel', 'Çatdırılma Statusu')}</Label>
          <Select
            value={deliveryStatus}
            onValueChange={(val) => setDeliveryStatus(val as DeliveryStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='pending'>{t('status.pending', 'Gözləmədə')}</SelectItem>
              <SelectItem value='confirmed'>{t('status.confirmed', 'Təsdiqləndi')}</SelectItem>
              <SelectItem value='picked_up'>{t('status.picked_up', 'Kuryerə verildi')}</SelectItem>
              <SelectItem value='on_the_way'>{t('status.on_the_way', 'Yoldadır')}</SelectItem>
              <SelectItem value='delivered'>{t('status.delivered', 'Çatdırıldı')}</SelectItem>
              <SelectItem value='cancelled'>{t('status.cancelled', 'Ləğv edildi')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='grid gap-2'>
          <Label>{t('dialog.paymentStatusLabel', 'Ödəniş Statusu')}</Label>
          <Select
            value={paymentStatus}
            onValueChange={(val) => setPaymentStatus(val as PaymentStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='unpaid'>{t('payment.unpaid', 'Ödənilməyib')}</SelectItem>
              <SelectItem value='paid'>{t('payment.paid', 'Ödənilib')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button variant='outline' onClick={onClose}>
          {t('dialog.cancel', 'Ləğv et')}
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? t('dialog.saving', 'Yadda saxlanılır...') : t('dialog.save', 'Yadda saxla')}
        </Button>
      </DialogFooter>
    </>
  )
}

interface ManageOrderDialogProps {
  order: OrderItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageOrderDialog({
  order,
  open,
  onOpenChange,
}: ManageOrderDialogProps) {
  const { t } = useTranslation('orders')
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {t('dialog.title', 'Sifarişi İdarə Et')} - #{order.code}
          </DialogTitle>
        </DialogHeader>
        <ManageOrderForm
          key={`${order.id}-${order.delivery_status}-${order.payment_status}`}
          order={order}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
