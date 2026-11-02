import { User, Mail, Phone, ShoppingBag, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { type CustomerItem } from '../data/customers.type'

interface CustomerDetailDialogProps {
  customer: CustomerItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleBan: (id: number, current: boolean) => void
}

export function CustomerDetailDialog({
  customer,
  open,
  onOpenChange,
  onToggleBan,
}: CustomerDetailDialogProps) {
  const { t } = useTranslation('customers')

  if (!customer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <User className='size-5 text-primary' />
            {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-2 text-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Mail className='size-4' />
              <span>{customer.email}</span>
            </div>
            {customer.is_verified ? (
              <Badge variant='success' className='gap-1'>
                <ShieldCheck className='size-3' />
                {t('verified', 'Təsdiqlənmiş')}
              </Badge>
            ) : (
              <Badge variant='warning' className='gap-1'>
                <ShieldAlert className='size-3' />
                {t('unverified', 'Təsdiqlənməmiş')}
              </Badge>
            )}
          </div>

          <div className='flex items-center gap-2 text-muted-foreground'>
            <Phone className='size-4' />
            <span>{customer.phone}</span>
          </div>

          <Separator />

          <div className='grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-3'>
            <div>
              <div className='text-xs text-muted-foreground'>{t('balance', 'Balans')}</div>
              <div className='text-base font-bold text-foreground'>{customer.balance.toFixed(2)} ₼</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>{t('package', 'Paket')}</div>
              <div className='text-base font-semibold text-primary'>{customer.package_name ?? '—'}</div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>{t('orders', 'Sifariş Sayı')}</div>
              <div className='flex items-center gap-1 font-semibold'>
                <ShoppingBag className='size-3.5 text-muted-foreground' />
                {customer.orders_count}
              </div>
            </div>
            <div>
              <div className='text-xs text-muted-foreground'>{t('totalSpent', 'Ümumi Xərclənən')}</div>
              <div className='font-bold text-foreground'>{customer.total_spent.toFixed(2)} ₼</div>
            </div>
          </div>

          <div className='flex items-center justify-between text-xs text-muted-foreground pt-1'>
            <span>{t('registeredAt', 'Qeydiyyat tarixi')}:</span>
            <span>{customer.created_at}</span>
          </div>
        </div>

        <DialogFooter className='flex items-center justify-between sm:justify-between'>
          <Button
            variant={customer.is_banned ? 'outline' : 'destructive'}
            size='sm'
            onClick={() => onToggleBan(customer.id, customer.is_banned)}
          >
            {customer.is_banned ? t('unban', 'Blokdan çıxar') : t('ban', 'Hesabı blokla')}
          </Button>
          <Button variant='secondary' size='sm' onClick={() => onOpenChange(false)}>
            {t('close', 'Bağla')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
