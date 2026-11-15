import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { StatsResponse } from '../data/qrcode-event.type'

const Chart = lazy(() => import('./qr-checks-chart'))

export function QrChecksChartCard({ data }: { data: StatsResponse['chart'] }) {
  const { t } = useTranslation('qrcode_event')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('stats.chart')}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className='py-12 text-center text-sm text-muted-foreground'>{t('stats.chartEmpty')}</p>
        ) : (
          <Suspense fallback={<Skeleton className='h-65 w-full' />}>
            <Chart data={data} />
          </Suspense>
        )}
      </CardContent>
    </Card>
  )
}
