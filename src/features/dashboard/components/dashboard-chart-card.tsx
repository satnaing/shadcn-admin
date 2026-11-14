import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardVisitPoint } from '../data/dashboard.type'

const VisitsChart = lazy(() => import('./dashboard-visits-chart'))

export function DashboardChartCard({ data }: { data: DashboardVisitPoint[] }) {
  const { t } = useTranslation('dashboard')

  return (
    <Card className='lg:col-span-4'>
      <CardHeader>
        <CardTitle>{t('chart.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className='py-12 text-center text-sm text-muted-foreground'>{t('chart.empty')}</p>
        ) : (
          <Suspense fallback={<Skeleton className='h-65 w-full' />}>
            <VisitsChart data={data} />
          </Suspense>
        )}
      </CardContent>
    </Card>
  )
}
