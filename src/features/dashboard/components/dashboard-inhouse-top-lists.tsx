import { useState } from 'react'
import { FolderTree, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { RankingPeriod, InhouseTopCategory, InhouseTopBrand } from '../data/dashboard.type'

type Props = {
  categories: Record<RankingPeriod, InhouseTopCategory[]>
  brands: Record<RankingPeriod, InhouseTopBrand[]>
}

const PERIODS: RankingPeriod[] = ['all', 'today', 'week', 'month']

export function DashboardInhouseTopLists({ categories, brands }: Props) {
  const { t } = useTranslation('dashboard')
  const { formatMoney } = useCurrencyFormatter()
  const [catPeriod, setCatPeriod] = useState<RankingPeriod>('all')
  const [brandPeriod, setBrandPeriod] = useState<RankingPeriod>('all')

  const activeCategories = categories[catPeriod] ?? []
  const activeBrands = brands[brandPeriod] ?? []

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      {/* 1. In-house Top Category */}
      <Card className='h-full overflow-hidden border shadow-sm'>
        <CardContent className='flex h-full flex-col p-5'>
          <div className='flex items-center justify-between border-b pb-3'>
            <div>
              <h3 className='text-sm font-bold text-primary'>
                {t('rankings.inhouseTopCategory')}
              </h3>
              <p className='text-[11px] text-muted-foreground'>{t('rankings.bySales')}</p>
            </div>
            <div className='flex rounded-full bg-muted p-0.5 text-[11px]'>
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type='button'
                  onClick={() => setCatPeriod(p)}
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    catPeriod === p
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(`periods.${p}`)}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-3 flex-1 divide-y overflow-y-auto'>
            {activeCategories.map((c) => (
              <div key={c.id} className='flex items-center justify-between py-2 text-xs'>
                <div className='flex items-center gap-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded border bg-muted text-muted-foreground'>
                    <FolderTree className='h-3.5 w-3.5' />
                  </div>
                  <span className='font-medium text-foreground'>{c.name}</span>
                </div>
                <span className='font-bold text-rose-600 dark:text-rose-400'>
                  {formatMoney(c.total)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. In-house Top Brands */}
      <Card className='h-full overflow-hidden border shadow-sm'>
        <CardContent className='flex h-full flex-col p-5'>
          <div className='flex items-center justify-between border-b pb-3'>
            <div>
              <h3 className='text-sm font-bold text-rose-600 dark:text-rose-400'>
                {t('rankings.inhouseTopBrands')}
              </h3>
              <p className='text-[11px] text-muted-foreground'>{t('rankings.bySales')}</p>
            </div>
            <div className='flex rounded-full bg-muted p-0.5 text-[11px]'>
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type='button'
                  onClick={() => setBrandPeriod(p)}
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    brandPeriod === p
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(`periods.${p}`)}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-3 flex-1 divide-y overflow-y-auto'>
            {activeBrands.map((b) => (
              <div key={b.id} className='flex items-center justify-between py-2 text-xs'>
                <div className='flex items-center gap-2'>
                  <div className='flex h-8 w-8 items-center justify-center rounded border bg-muted text-muted-foreground'>
                    <Tag className='h-3.5 w-3.5' />
                  </div>
                  <span className='font-medium text-foreground'>{b.name}</span>
                </div>
                <span className='font-bold text-rose-600 dark:text-rose-400'>
                  {formatMoney(b.total)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
