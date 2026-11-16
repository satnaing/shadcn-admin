import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { usePreorderDashboard } from '../hooks/use-preorder'
import { PreorderDashboardCards } from './preorder-dashboard-cards'
import { PreorderSalesChartCard } from './preorder-sales-chart-card'
import { PreorderTopProducts } from './preorder-top-products'

export function PreorderDashboardPage() {
  const { t } = useTranslation('preorder')
  const { data } = usePreorderDashboard()
  const stats = data?.data

  return (
    <AdminPageShell
      title={t('dashboard.title')}
      description={t('dashboard.description')}
    >
      {stats ? (
        <>
          <PreorderDashboardCards stats={stats} />
          <div className='grid gap-4 lg:grid-cols-2'>
            <PreorderSalesChartCard data={stats.monthly_sales} />
            <PreorderTopProducts />
          </div>
        </>
      ) : (
        <Skeleton className='h-64 w-full' />
      )}
    </AdminPageShell>
  )
}
