import { Link } from '@tanstack/react-router'
import { ArrowRight, Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { DashboardInhouseStore } from '../data/dashboard.type'

type Props = {
  inhouseStore: DashboardInhouseStore
}

const STATUS_COLOR_CLASSES: Record<string, string> = {
  pending: 'bg-[#F74396]',
  confirmed: 'bg-[#24BF85]',
  processed: 'bg-[#4E9FF4]',
  shipped: 'bg-[#65D3E6]',
  delivered: 'bg-[#FFBB32]',
  cancelled: 'bg-[#F76464]',
}

export function DashboardInhouseStoreCard({ inhouseStore }: Props) {
  const { t } = useTranslation('dashboard')
  const { formatMoney } = useCurrencyFormatter()

  return (
    <Card className='overflow-hidden border shadow-sm'>
      <CardContent className='p-5 sm:p-6'>
        {/* Header */}
        <div className='flex items-center justify-between border-b pb-4'>
          <h2 className='text-base font-bold text-foreground'>{t('inhouseStore.title')}</h2>
          <div className='flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400'>
            <span className='h-2 w-2 rounded-full bg-blue-500' />
            <span>{t('orders.fulfilmentRate')}</span>
            <span>{inhouseStore.fulfillment_rate}%</span>
          </div>
        </div>

        {/* Total Sales & 3 Metric Cards */}
        <div className='mt-4'>
          <p className='text-2xl font-bold tracking-tight text-foreground'>
            {formatMoney(inhouseStore.total_sales)}
          </p>
          <h3 className='text-xs font-medium text-muted-foreground'>
            {t('inhouseStore.totalSales')}
          </h3>
        </div>

        <div className='mt-3 grid grid-cols-3 gap-2'>
          <div className='rounded-lg bg-muted/50 p-2.5 text-center'>
            <p className='text-base font-bold text-foreground'>
              {inhouseStore.total_orders.toLocaleString()}
            </p>
            <span className='text-[11px] text-muted-foreground'>
              {t('inhouseStore.totalOrders')}
            </span>
          </div>
          <div className='rounded-lg bg-muted/50 p-2.5 text-center'>
            <p className='text-base font-bold text-foreground'>
              {inhouseStore.total_products.toLocaleString()}
            </p>
            <span className='text-[11px] text-muted-foreground'>
              {t('inhouseStore.inhouseProducts')}
            </span>
          </div>
          <div className='rounded-lg bg-muted/50 p-2.5 text-center'>
            <p className='flex items-center justify-center gap-1 text-base font-bold text-foreground'>
              <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
              <span>{inhouseStore.rating.toFixed(2)}</span>
            </p>
            <span className='text-[11px] text-muted-foreground'>
              {t('inhouseStore.ratings')}
            </span>
          </div>
        </div>

        {/* 6 status progress bars in 2 columns */}
        <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {inhouseStore.pipeline.map((item) => {
            const colorClass = STATUS_COLOR_CLASSES[item.key] ?? 'bg-primary'
            return (
              <div key={item.key} className='space-y-1 text-xs'>
                <div className='flex items-center justify-between'>
                  <span className='font-medium text-foreground'>
                    {t(`pipeline.${item.key}`)}
                    <span className='ml-1 text-muted-foreground'>({item.percentage}%)</span>
                  </span>
                  <span className='font-bold text-foreground'>{item.count.toLocaleString()}</span>
                </div>
                <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                  <div
                    className={`h-full rounded-full transition-all ${colorClass}`}
                    aria-valuenow={item.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className='mt-5 border-t pt-3'>
          <Link
            to='/admin/users'
            className='inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline'
          >
            <span>{t('inhouseStore.allInhouseOrders')}</span>
            <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
