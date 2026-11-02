import { Users, Package, FolderTree, Tag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { DashboardKpis } from '../data/dashboard.type'

type Props = {
  kpis: DashboardKpis
}

const BADGE_COLORS = ['bg-rose-500', 'bg-amber-500', 'bg-blue-500']

export function DashboardKpiCards({ kpis }: Props) {
  const { t } = useTranslation('dashboard')
  const { formatMoney } = useCurrencyFormatter()

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
      {/* 1. Registered Customers */}
      <Card className='h-[210px] overflow-hidden border shadow-sm'>
        <CardContent className='flex h-full flex-col justify-between p-5'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-3xl font-bold tracking-tight text-foreground'>
                {kpis.total_customers.toLocaleString()}
              </p>
              <h3 className='text-xs font-medium text-muted-foreground'>
                {t('kpi.registeredCustomer')}
              </h3>
            </div>
            <div className='rounded-lg bg-primary/10 p-2.5 text-primary'>
              <Users className='h-5 w-5' />
            </div>
          </div>
          <div>
            <p className='mb-2 text-xs font-medium text-muted-foreground'>
              {t('kpi.topCustomers')}
            </p>
            <div className='flex -space-x-2 overflow-hidden'>
              {kpis.top_customers.map((c) => (
                <div
                  key={c.id}
                  title={c.name}
                  className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[11px] font-semibold text-foreground ring-1 ring-border'
                >
                  {c.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Products */}
      <Card className='h-[210px] overflow-hidden border shadow-sm'>
        <CardContent className='flex h-full flex-col justify-between p-5'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-3xl font-bold tracking-tight text-foreground'>
                {kpis.total_products.toLocaleString()}
              </p>
              <h3 className='text-xs font-medium text-muted-foreground'>
                {t('kpi.totalProducts')}
              </h3>
            </div>
            <div className='rounded-lg bg-blue-500/10 p-2.5 text-blue-500'>
              <Package className='h-5 w-5' />
            </div>
          </div>
          <div className='space-y-1.5 text-xs'>
            <div className='flex items-center justify-between'>
              <span className='flex items-center text-muted-foreground'>
                <span className='mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500' />
                {t('kpi.inhouseProducts')}
              </span>
              <span className='font-semibold text-foreground'>
                {kpis.total_inhouse_products.toLocaleString()}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='flex items-center text-muted-foreground'>
                <span className='mr-2 inline-block h-2 w-2 rounded-full bg-primary' />
                {t('kpi.sellersProducts')}
              </span>
              <span className='font-semibold text-foreground'>
                {kpis.total_sellers_products.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Total Category */}
      <Card className='h-[210px] overflow-hidden border shadow-sm'>
        <CardContent className='flex h-full flex-col justify-between p-5'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-3xl font-bold tracking-tight text-foreground'>
                {kpis.total_categories.toLocaleString()}
              </p>
              <h3 className='text-xs font-medium text-muted-foreground'>
                {t('kpi.totalCategory')}
              </h3>
            </div>
            <div className='rounded-lg bg-amber-500/10 p-2.5 text-amber-500'>
              <FolderTree className='h-5 w-5' />
            </div>
          </div>
          <div className='space-y-1 text-xs'>
            {kpis.top_categories.slice(0, 3).map((cat, i) => (
              <div key={cat.id} className='flex items-center justify-between'>
                <span className='flex max-w-[150px] items-center truncate text-muted-foreground'>
                  <span className={`mr-2 inline-block h-2 w-2 rounded-full ${BADGE_COLORS[i]}`} />
                  {cat.name}
                </span>
                <span className='font-semibold text-foreground'>{formatMoney(cat.total)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Total Brands */}
      <Card className='h-[210px] overflow-hidden border shadow-sm'>
        <CardContent className='flex h-full flex-col justify-between p-5'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-3xl font-bold tracking-tight text-foreground'>
                {kpis.total_brands.toLocaleString()}
              </p>
              <h3 className='text-xs font-medium text-muted-foreground'>
                {t('kpi.totalBrands')}
              </h3>
            </div>
            <div className='rounded-lg bg-purple-500/10 p-2.5 text-purple-500'>
              <Tag className='h-5 w-5' />
            </div>
          </div>
          <div className='space-y-1 text-xs'>
            {kpis.top_brands.slice(0, 3).map((brand, i) => (
              <div key={brand.id} className='flex items-center justify-between'>
                <span className='flex max-w-[150px] items-center truncate text-muted-foreground'>
                  <span className={`mr-2 inline-block h-2 w-2 rounded-full ${BADGE_COLORS[i]}`} />
                  {brand.name}
                </span>
                <span className='font-semibold text-foreground'>{formatMoney(brand.total)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
