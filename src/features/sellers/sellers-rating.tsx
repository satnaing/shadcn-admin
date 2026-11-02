import { useState } from 'react'
import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SellerRatingStatCards } from './components/seller-rating-stat-cards'
import { useSellers } from './hooks/useSellers'

export function SellersRating() {
  const { t } = useTranslation('sellers')
  const [search, setSearch] = useState('')
  const { data, isLoading } = useSellers()

  const rawSellers = data?.data ?? []
  const filtered = rawSellers
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.rating - a.rating || b.followers_count - a.followers_count)

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('titles.rating', 'Reytinq və İzləyicilər')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('titles.ratingSubtitle', 'Satıcıların müştəri rəyləri və izləyici statistikası')}
          </p>
        </div>

        <SellerRatingStatCards sellers={rawSellers} />

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <div className='max-w-sm'>
            <Input
              placeholder={t('filter.searchPlaceholder', 'Mağaza axtar...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[60px]'>Sıra</TableHead>
                  <TableHead>{t('table.shop', 'Mağaza')}</TableHead>
                  <TableHead>{t('detail.rating', 'Reytinq')}</TableHead>
                  <TableHead>{t('rating.followers', 'İzləyici')}</TableHead>
                  <TableHead>{t('detail.products', 'Məhsullar')}</TableHead>
                  <TableHead className='text-right'>{t('detail.orders', 'Sifarişlər')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                      {t('table.loading', 'Yüklənir...')}
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
                      {t('table.empty', 'Məlumat tapılmadı')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s, idx) => (
                    <TableRow key={s.id}>
                      <TableCell className='font-bold text-muted-foreground'>#{idx + 1}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          {s.logo && <img src={s.logo} alt={s.name} className='size-8 rounded-full object-cover' />}
                          <span className='font-semibold'>{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1 font-bold text-amber-500'>
                          <Star className='size-4 fill-amber-500' />
                          <span>{s.rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>{s.followers_count}</TableCell>
                      <TableCell>{s.products_count}</TableCell>
                      <TableCell className='text-right'>{s.orders_count}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Main>
    </>
  )
}

export default SellersRating
