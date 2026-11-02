import { useState } from 'react'
import { FolderTree, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { RankingPeriod, TopCategoryGroup } from '../data/dashboard.type'

type Props = {
  data: Record<RankingPeriod, TopCategoryGroup[]>
}

const PERIODS: RankingPeriod[] = ['today', 'week', 'month', 'all']

export function DashboardTopCategoryProducts({ data }: Props) {
  const { t } = useTranslation('dashboard')
  const { formatMoney } = useCurrencyFormatter()
  const [period, setPeriod] = useState<RankingPeriod>('all')
  const categories = data[period] ?? []
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const activeCategory =
    categories.find((c) => c.category_id === selectedCategoryId) ?? categories[0]
  const products = activeCategory?.products ?? []

  return (
    <Card className='h-full overflow-hidden border shadow-sm'>
      <CardContent className='flex h-full flex-col p-5 sm:p-6'>
        {/* Header & Period Tabs */}
        <div className='flex flex-wrap items-center justify-between gap-3 border-b pb-4'>
          <div>
            <h2 className='text-base font-bold text-foreground'>
              {t('rankings.topCategoryProducts')}
            </h2>
            <p className='text-xs text-muted-foreground'>{t('rankings.bySales')}</p>
          </div>

          <div className='flex rounded-full bg-muted p-1 text-xs'>
            {PERIODS.map((p) => (
              <button
                key={p}
                type='button'
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1 font-medium transition-all ${
                  period === p
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(`periods.${p}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Categories horizontal strip */}
        <div className='my-4 flex gap-2 overflow-x-auto pb-1'>
          {categories.map((cat) => {
            const isSelected = (activeCategory?.category_id ?? 0) === cat.category_id
            return (
              <button
                key={cat.category_id}
                type='button'
                onClick={() => setSelectedCategoryId(cat.category_id)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors shrink-0 ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary font-semibold'
                    : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30'
                }`}
              >
                <FolderTree className='h-4 w-4 shrink-0' />
                <span className='max-w-[130px] truncate'>{cat.category_name}</span>
              </button>
            )
          })}
        </div>

        {/* Products Table */}
        <div className='flex-1 overflow-y-auto'>
          {products.length === 0 ? (
            <p className='py-8 text-center text-xs text-muted-foreground'>
              {t('rankings.nothingFound')}
            </p>
          ) : (
            <table className='w-full text-left text-xs'>
              <thead>
                <tr className='border-b text-muted-foreground'>
                  <th className='pb-2 font-medium'>{t('rankings.item')}</th>
                  <th className='pb-2 text-center font-medium'>{t('rankings.quantity')}</th>
                  <th className='pb-2 text-right font-medium'>{t('rankings.totalPrice')}</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {products.map((p) => (
                  <tr key={p.id} className='group hover:bg-muted/40'>
                    <td className='py-2.5 pr-2'>
                      <div className='flex items-center gap-2.5'>
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded border bg-muted text-muted-foreground'>
                          <Package className='h-4 w-4' />
                        </div>
                        <span className='max-w-[200px] truncate font-medium text-foreground group-hover:text-primary'>
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className='py-2.5 text-center font-semibold text-foreground'>
                      X {p.sales}
                    </td>
                    <td className='py-2.5 text-right font-bold text-foreground'>
                      {formatMoney(p.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
