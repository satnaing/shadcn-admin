import { ArrowRight, Flame, Ticket } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { FlashDealsTable } from './components/flash-deals-table'
import { PromotionsSummaryCards } from './components/promotions-summary-cards'
import {
  useCategoryDiscounts,
  useCoupons,
  useFlashDeals,
  usePromotionMutations,
  usePromotionalProducts,
} from './hooks/usePromotions'

export function PromotionsDashboard() {
  const { t } = useTranslation('promotions')

  const { data: dealsData, isLoading: dealsLoading } = useFlashDeals()
  const { data: couponsData } = useCoupons()
  const { data: catDiscountsData } = useCategoryDiscounts()
  const { data: productsData } = usePromotionalProducts()

  const { flashDealStatusMutation, flashDealFeaturedMutation, deleteFlashDealMutation } =
    usePromotionMutations()

  const deals = dealsData?.data ?? []
  const coupons = couponsData?.data ?? []
  const catDiscounts = catDiscountsData?.data ?? []
  const promoProducts = productsData?.data ?? []

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('titles.dashboard', 'Promosiya və Təkliflər')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('titles.dashboardSubtitle', 'Flash satışlar, endirim kuponları və xüsusi aksiyaların idarəsi')}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button asChild variant='outline' className='gap-2'>
              <Link to='/admin/promotions/coupons/create'>
                <Ticket className='size-4' />
                Yeni Kupon
              </Link>
            </Button>
            <Button asChild className='gap-2'>
              <Link to='/admin/promotions/flash-deals/create'>
                <Flame className='size-4' />
                Yeni Flash Satış
              </Link>
            </Button>
          </div>
        </div>

        <PromotionsSummaryCards
          activeDealsCount={deals.filter((d) => d.status).length}
          activeCouponsCount={coupons.filter((c) => c.status).length}
          totalCategoriesDiscounted={catDiscounts.filter((c) => c.status).length}
          promotionalProductsCount={promoProducts.length}
        />

        <div className='space-y-4 rounded-lg border bg-card p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Flame className='size-5 text-amber-500' />
              <h2 className='text-lg font-bold'>Aktiv Flash Satışlar</h2>
            </div>
            <Button asChild variant='ghost' size='sm' className='gap-1 text-xs'>
              <Link to='/admin/promotions/flash-deals'>
                Hamısına bax <ArrowRight className='size-3.5' />
              </Link>
            </Button>
          </div>

          <FlashDealsTable
            deals={deals.slice(0, 5)}
            isLoading={dealsLoading}
            onToggleStatus={(id, st) => flashDealStatusMutation.mutate({ id, status: !st })}
            onToggleFeatured={(id, ft) => flashDealFeaturedMutation.mutate({ id, featured: !ft })}
            onDelete={(id) => deleteFlashDealMutation.mutate(id)}
          />
        </div>
      </Main>
    </>
  )
}

export default PromotionsDashboard
