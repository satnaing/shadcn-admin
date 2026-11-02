import { Star, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type SellerItem } from '../data/sellers.type'

interface StatCardsProps {
  sellers: SellerItem[]
}

export function SellerRatingStatCards({ sellers }: StatCardsProps) {
  const { t } = useTranslation('sellers')
  const topSeller = [...sellers].sort((a, b) => b.rating - a.rating)[0]
  const totalFollowers = sellers.reduce((acc, s) => acc + s.followers_count, 0)
  const avgRating = (sellers.reduce((acc, s) => acc + s.rating, 0) / (sellers.length || 1)).toFixed(2)

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-muted-foreground'>
            {t('rating.topRated', 'Ən Yüksək Reytinqli Mağazalar')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2 text-2xl font-bold text-amber-500'>
            <Star className='size-6 fill-amber-500' />
            <span>{topSeller?.rating.toFixed(1) ?? '5.0'}</span>
          </div>
          <div className='text-xs text-muted-foreground mt-1'>{topSeller?.name ?? '—'}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-muted-foreground'>
            {t('rating.totalFollowers', 'Cəmi Mağaza İzləyiciləri')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center gap-2 text-2xl font-bold text-primary'>
            <Users className='size-6' />
            <span>{totalFollowers}</span>
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Bütün mağazalar üzrə</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xs font-medium text-muted-foreground'>
            {t('rating.avgRating', 'Orta Reytinq')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{avgRating}</div>
          <div className='text-xs text-muted-foreground mt-1'>Ümumi platforma orta balı</div>
        </CardContent>
      </Card>
    </div>
  )
}
