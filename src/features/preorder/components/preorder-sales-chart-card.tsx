import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const Chart = lazy(() => import('./preorder-sales-chart'))

export function PreorderSalesChartCard({ data }: { data: number[] }) {
  const { t } = useTranslation('preorder')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.salesChart')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className='h-65 w-full' />}>
          <Chart data={data} />
        </Suspense>
      </CardContent>
    </Card>
  )
}
