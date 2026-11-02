import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import type { DashboardOrdersPipeline } from '../data/dashboard.type'

type Props = {
  orders: DashboardOrdersPipeline
}

const STATUS_COLOR_CLASSES: Record<string, string> = {
  pending: 'bg-[#F74396]',
  confirmed: 'bg-[#24BF85]',
  processed: 'bg-[#4E9FF4]',
  shipped: 'bg-[#65D3E6]',
  delivered: 'bg-[#FFBB32]',
  cancelled: 'bg-[#F76464]',
}

export function DashboardOrdersCard({ orders }: Props) {
  const { t } = useTranslation('dashboard')

  return (
    <Card className='overflow-hidden border shadow-sm'>
      <CardContent className='p-5 sm:p-6'>
        {/* Header */}
        <div className='flex items-center justify-between border-b pb-4'>
          <h2 className='text-base font-bold text-foreground'>{t('orders.title')}</h2>
          <div className='flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400'>
            <span className='h-2 w-2 rounded-full bg-blue-500' />
            <span>{t('orders.fulfilmentRate')}</span>
            <span>{orders.fulfillment_rate}%</span>
          </div>
        </div>

        {/* Content grid */}
        <div className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-12'>
          {/* Left summary */}
          <div className='flex flex-col justify-between space-y-4 md:col-span-5'>
            <div>
              <p className='text-3xl font-bold tracking-tight text-foreground'>
                {orders.total_orders.toLocaleString()}
              </p>
              <h3 className='text-xs font-medium text-muted-foreground'>
                {t('orders.allTypesOfOrders')}
              </h3>
            </div>

            <div className='space-y-3'>
              <div className='rounded-lg bg-muted/50 p-3'>
                <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                  <span className='h-2 w-2 rounded-full bg-emerald-500' />
                  <span>{t('orders.inhouseOrders')}</span>
                </div>
                <p className='mt-1 text-lg font-bold text-foreground'>
                  {orders.inhouse_orders.toLocaleString()}
                </p>
                <span className='text-[11px] text-muted-foreground'>
                  {orders.inhouse_order_percentage}% {t('orders.ofTotal')}
                </span>
              </div>

              <div className='rounded-lg bg-muted/50 p-3'>
                <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                  <span className='h-2 w-2 rounded-full bg-primary' />
                  <span>{t('orders.sellerOrders')}</span>
                </div>
                <p className='mt-1 text-lg font-bold text-foreground'>
                  {orders.seller_orders.toLocaleString()}
                </p>
                <span className='text-[11px] text-muted-foreground'>
                  {orders.seller_order_percentage}% {t('orders.ofTotal')}
                </span>
              </div>
            </div>
          </div>

          {/* Right: 6 status progress bars */}
          <div className='space-y-3 md:col-span-7'>
            {orders.pipeline.map((item) => {
              const colorClass = STATUS_COLOR_CLASSES[item.key] ?? 'bg-primary'
              return (
                <div key={item.key} className='space-y-1 text-xs'>
                  <div className='flex items-center justify-between'>
                    <span className='font-medium text-foreground'>
                      {t(`pipeline.${item.key}`)}
                      <span className='ml-1.5 text-muted-foreground'>
                        ({item.percentage}%)
                      </span>
                    </span>
                    <span className='font-bold text-foreground'>
                      {item.count.toLocaleString()}
                    </span>
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
        </div>

        {/* Footer */}
        <div className='mt-5 border-t pt-3'>
          <Link
            to='/admin/users'
            className='inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline'
          >
            <span>{t('orders.viewAllOrders')}</span>
            <ArrowRight className='h-3.5 w-3.5' />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
