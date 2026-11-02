import { useState } from 'react'
import { Store, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { RankingPeriod, TopSellerGroup } from '../data/dashboard.type'

type Props = {
  data: Record<RankingPeriod, TopSellerGroup[]>
}

const PERIODS: RankingPeriod[] = ['today', 'week', 'month', 'all']

export function DashboardTopSellerProducts({ data }: Props) {
  const { t } = useTranslation('dashboard')
  const { formatMoney } = useCurrencyFormatter()
  const [period, setPeriod] = useState<RankingPeriod>('all')
  const sellers = data[period] ?? []
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null)

  const activeSeller =
    sellers.find((s) => s.seller_id === selectedSellerId) ?? sellers[0]
  const products = activeSeller?.products ?? []

  return (
    <Card className='h-full overflow-hidden border shadow-sm'>
      <CardContent className='flex h-full flex-col p-5 sm:p-6'>
        {/* Header & Period Tabs */}
        <div className='flex flex-wrap items-center justify-between gap-3 border-b pb-4'>
          <div>
            <h2 className='text-base font-bold text-foreground'>
              {t('rankings.topSellerProducts')}
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

        {/* Sellers horizontal strip */}
        <div className='my-4 flex gap-2 overflow-x-auto pb-1'>
          {sellers.map((s) => {
            const isSelected = (activeSeller?.seller_id ?? 0) === s.seller_id
            return (
              <button
                key={s.seller_id}
                type='button'
                onClick={() => setSelectedSellerId(s.seller_id)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-colors shrink-0 ${
                  isSelected
                    ? 'border-primary bg-primary/5 text-primary font-semibold'
                    : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30'
                }`}
              >
                <Store className='h-4 w-4 shrink-0' />
                <span className='max-w-[130px] truncate'>{s.shop_name}</span>
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
