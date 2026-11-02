import { useTranslation } from 'react-i18next'
import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { DashboardKpis } from '../data/dashboard.type'

type Props = {
  kpis: DashboardKpis
}

export function DashboardSalesCard({ kpis }: Props) {
  const { t } = useTranslation('dashboard')
  const { formatMoney } = useCurrencyFormatter()

  return (
    <Card className='h-full overflow-hidden border shadow-sm'>
      <CardContent className='flex h-full flex-col justify-between p-5'>
        <div>
          <p className='text-3xl font-bold tracking-tight text-foreground'>
            {formatMoney(kpis.total_sale)}
          </p>
          <h3 className='text-xs font-medium text-muted-foreground'>
            {t('kpi.allTimeSales')}
          </h3>
        </div>

        <div className='my-3 flex items-center justify-between rounded-lg bg-primary p-3 text-primary-foreground'>
          <span className='text-xs font-medium'>{t('kpi.salesThisMonth')}</span>
          <span className='text-sm font-bold'>{formatMoney(kpis.sale_this_month)}</span>
        </div>

        <div className='mb-2'>
          <span className='text-xs font-medium text-muted-foreground'>
            {t('kpi.salesState')}
          </span>
          <div className='mt-2 h-28 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={kpis.yearly_sales}>
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as { month: string; total: number }
                      return (
                        <div className='rounded bg-popover p-2 text-xs shadow ring-1 ring-border'>
                          <p className='font-semibold'>{data.month}</p>
                          <p className='text-primary'>{formatMoney(data.total)}</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey='total'
                  fill='currentColor'
                  className='fill-primary'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='space-y-2 border-t pt-3 text-xs'>
          <div className='flex items-center justify-between'>
            <span className='flex items-center text-muted-foreground'>
              <span className='mr-2 inline-block h-2 w-2 rounded-full bg-sky-500' />
              {t('kpi.inhouseSales')}
            </span>
            <span className='font-semibold text-foreground'>
              {formatMoney(kpis.inhouse_sale_this_month)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='flex items-center text-muted-foreground'>
              <span className='mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500' />
              {t('kpi.sellersSales')}
            </span>
            <span className='font-semibold text-foreground'>
              {formatMoney(kpis.seller_sale_this_month)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
