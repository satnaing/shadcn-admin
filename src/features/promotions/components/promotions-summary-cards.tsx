import { Flame, Percent, Tag, Ticket } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SummaryProps {
  activeDealsCount: number
  activeCouponsCount: number
  totalCategoriesDiscounted: number
  promotionalProductsCount: number
}

export function PromotionsSummaryCards({
  activeDealsCount,
  activeCouponsCount,
  totalCategoriesDiscounted,
  promotionalProductsCount,
}: SummaryProps) {
  const { t } = useTranslation('promotions')

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-muted-foreground'>
            {t('summary.activeFlashDeals', 'Aktiv Flash Satışlar')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2 text-2xl font-bold text-amber-500'>
            <Flame className='size-6 fill-amber-500' />
            <span>{activeDealsCount}</span>
          </div>
          <p className='text-xs text-muted-foreground mt-1'>Müddətli qaynar təkliflər</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-muted-foreground'>
            {t('summary.activeCoupons', 'Aktiv Kuponlar')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2 text-2xl font-bold text-primary'>
            <Ticket className='size-6' />
            <span>{activeCouponsCount}</span>
          </div>
          <p className='text-xs text-muted-foreground mt-1'>Endirim kodları</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-muted-foreground'>
            {t('summary.discountedCategories', 'Endirimli Kateqoriyalar')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
            <Percent className='size-6' />
            <span>{totalCategoriesDiscounted}</span>
          </div>
          <p className='text-xs text-muted-foreground mt-1'>Toplu kateqoriya endirimləri</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-muted-foreground'>
            {t('summary.promotionalProducts', 'Promosiya Məhsulları')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400'>
            <Tag className='size-6' />
            <span>{promotionalProductsCount}</span>
          </div>
          <p className='text-xs text-muted-foreground mt-1'>Aktiv aksiyadakı məhsullar</p>
        </CardContent>
      </Card>
    </div>
  )
}
