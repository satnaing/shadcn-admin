import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  type DeliveryStatus,
  type OrderFilterParams,
  type PaymentStatus,
} from '../data/orders.type'

interface OrderFilterBarProps {
  filters: OrderFilterParams
  onChange: (filters: OrderFilterParams) => void
  onReset: () => void
  hidePaymentFilter?: boolean
}

export function OrderFilterBar({
  filters,
  onChange,
  onReset,
  hidePaymentFilter = false,
}: OrderFilterBarProps) {
  const { t } = useTranslation('orders')

  return (
    <div className='flex flex-wrap items-center gap-3 py-2'>
      <div className='relative min-w-[220px] flex-1 max-w-sm'>
        <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
        <Input
          placeholder={t('filter.searchPlaceholder', 'Kod, müştəri və ya telefon...')}
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          className='pl-8'
        />
      </div>

      <Select
        value={filters.delivery_status ?? 'all'}
        onValueChange={(val) =>
          onChange({
            ...filters,
            delivery_status: val as DeliveryStatus | 'all',
            page: 1,
          })
        }
      >
        <SelectTrigger className='w-[170px]'>
          <SelectValue placeholder={t('filter.deliveryStatus', 'Çatdırılma statusu')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('filter.allStatuses', 'Bütün statuslar')}</SelectItem>
          <SelectItem value='pending'>{t('status.pending', 'Gözləmədə')}</SelectItem>
          <SelectItem value='confirmed'>{t('status.confirmed', 'Təsdiqləndi')}</SelectItem>
          <SelectItem value='picked_up'>{t('status.picked_up', 'Kuryerə verildi')}</SelectItem>
          <SelectItem value='on_the_way'>{t('status.on_the_way', 'Yoldadır')}</SelectItem>
          <SelectItem value='delivered'>{t('status.delivered', 'Çatdırıldı')}</SelectItem>
          <SelectItem value='cancelled'>{t('status.cancelled', 'Ləğv edildi')}</SelectItem>
        </SelectContent>
      </Select>

      {!hidePaymentFilter && (
        <Select
          value={filters.payment_status ?? 'all'}
          onValueChange={(val) =>
            onChange({
              ...filters,
              payment_status: val as PaymentStatus | 'all',
              page: 1,
            })
          }
        >
          <SelectTrigger className='w-[170px]'>
            <SelectValue placeholder={t('filter.paymentStatus', 'Ödəniş statusu')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('filter.allPayments', 'Bütün ödənişlər')}</SelectItem>
            <SelectItem value='paid'>{t('payment.paid', 'Ödənilib')}</SelectItem>
            <SelectItem value='unpaid'>{t('payment.unpaid', 'Ödənilməyib')}</SelectItem>
          </SelectContent>
        </Select>
      )}

      {(filters.search ||
        (filters.delivery_status && filters.delivery_status !== 'all') ||
        (filters.payment_status && filters.payment_status !== 'all')) && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onReset}
          className='text-muted-foreground hover:text-foreground'
        >
          <X className='mr-1.5 size-4' />
          {t('filter.reset', 'Sıfırla')}
        </Button>
      )}
    </div>
  )
}
