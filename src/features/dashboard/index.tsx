import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DashboardActivityCard } from './components/dashboard-activity'
import { DashboardChartCard } from './components/dashboard-chart-card'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { DashboardStats } from './components/dashboard-stats'
import { useDashboard } from './hooks/useDashboard'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const { data, isLoading, isError } = useDashboard()
  const dashboard = data?.data

  return (
    <AdminPageShell title={t('title')} description={t('description')}>
      {isLoading && <DashboardSkeleton />}
      {isError && (
        <Alert variant='destructive'>
          <AlertDescription>{t('error')}</AlertDescription>
        </Alert>
      )}
      {dashboard && (
        <div className='space-y-4'>
          <DashboardStats stats={dashboard.stats ?? []} />
          <div className='grid gap-4 lg:grid-cols-7'>
            <DashboardChartCard data={dashboard.visits ?? []} />
            <DashboardActivityCard items={dashboard.activity ?? []} />
          </div>
        </div>
      )}
    </AdminPageShell>
  )
}
