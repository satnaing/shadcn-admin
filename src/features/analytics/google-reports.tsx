import { Link } from '@tanstack/react-router'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { AnalyticsReportChart } from './components/analytics-report-chart'
import { useGa4Reports } from './hooks/useAnalytics'

export function GoogleReportsPage() {
  const { data: events = [], isLoading, refetch, isFetching } = useGa4Reports()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>GA4 Hadisə və Test Hesabatları</h1>
            <p className='text-sm text-muted-foreground'>
              Canlı axında baş verən e-ticarət və səhifə baxış hadisələrinin sınaq qeydləri
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Yenilə
            </Button>
            <Button variant='outline' size='sm' asChild>
              <Link to='/admin/analytics/google'>
                <ArrowLeft className='mr-2 h-4 w-4' /> Ayarlar
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <AnalyticsReportChart events={events} />
        )}
      </Main>
    </>
  )
}
