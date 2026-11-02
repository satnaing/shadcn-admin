import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { DashboardHeader } from './components/dashboard-header'
import { DashboardInhouseStoreCard } from './components/dashboard-inhouse-store-card'
import { DashboardInhouseTopLists } from './components/dashboard-inhouse-top-lists'
import { DashboardKpiCards } from './components/dashboard-kpi-cards'
import { DashboardOrdersCard } from './components/dashboard-orders-card'
import { DashboardSalesCard } from './components/dashboard-sales-card'
import { DashboardSellersCard } from './components/dashboard-sellers-card'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { DashboardTopBrandProducts } from './components/dashboard-top-brand-products'
import { DashboardTopCategoryProducts } from './components/dashboard-top-category-products'
import { DashboardTopSellerProducts } from './components/dashboard-top-seller-products'
import { useDashboardStats } from './hooks/useDashboardStats'

export function Dashboard() {
  const { t } = useTranslation('dashboard')
  const { stats, isLoading, isError } = useDashboardStats()

  return (
    <>
      <AdminHeader />

      <Main fluid className='flex flex-1 flex-col gap-6'>
        {isLoading ? (
          <DashboardSkeleton />
        ) : isError || !stats ? (
          <div className='rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center text-sm text-destructive'>
            {t('error')}
          </div>
        ) : (
          <>
            {/* Header & Date Widget */}
            <DashboardHeader />

            {/* Row 1: KPI Cards */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-12'>
              <div className='lg:col-span-6'>
                <DashboardKpiCards kpis={stats.kpis} />
              </div>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-6'>
                <DashboardSalesCard kpis={stats.kpis} />
                <DashboardSellersCard kpis={stats.kpis} />
              </div>
            </div>

            {/* Row 2: Orders & In-house Store */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <DashboardOrdersCard orders={stats.orders} />
              <DashboardInhouseStoreCard inhouseStore={stats.inhouse_store} />
            </div>

            {/* Row 3: Top Category Products & In-house Lists */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <DashboardTopCategoryProducts data={stats.top_category_products} />
              <DashboardInhouseTopLists
                categories={stats.inhouse_top_categories}
                brands={stats.inhouse_top_brands}
              />
            </div>

            {/* Row 4: Top Sellers & Top Brands */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <DashboardTopSellerProducts data={stats.top_sellers_products} />
              <DashboardTopBrandProducts data={stats.top_brands_products} />
            </div>
          </>
        )}
      </Main>
    </>
  )
}

export default Dashboard
