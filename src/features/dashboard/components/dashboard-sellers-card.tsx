import { Link } from '@tanstack/react-router'
import { Store } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { DashboardKpis } from '../data/dashboard.type'

type Props = {
  kpis: DashboardKpis
}

export function DashboardSellersCard({ kpis }: Props) {
  const { t } = useTranslation('dashboard')

  return (
    <Card className='h-full overflow-hidden border shadow-sm'>
      <CardContent className='flex h-full flex-col justify-between p-5'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-3xl font-bold tracking-tight text-foreground'>
              {kpis.total_sellers.toLocaleString()}
            </p>
            <h3 className='text-xs font-medium text-muted-foreground'>
              {t('kpi.sellersInPlatform')}
            </h3>
          </div>
          <div className='rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500'>
            <Store className='h-5 w-5' />
          </div>
        </div>

        <div className='space-y-2 text-xs'>
          <div className='flex items-center justify-between'>
            <span className='flex items-center text-muted-foreground'>
              <span className='mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500' />
              {t('kpi.approvedSellers')}
            </span>
            <span className='font-semibold text-foreground'>
              {kpis.total_approved_sellers.toLocaleString()}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='flex items-center text-muted-foreground'>
              <span className='mr-2 inline-block h-2 w-2 rounded-full bg-rose-500' />
              {t('kpi.pendingSellers')}
            </span>
            <span className='font-semibold text-foreground'>
              {kpis.total_pending_sellers.toLocaleString()}
            </span>
          </div>
        </div>

        <div>
          <p className='mb-2 text-xs font-medium text-muted-foreground'>
            {t('kpi.topSellers')}
          </p>
          <div className='flex -space-x-2 overflow-hidden'>
            {kpis.top_sellers.map((s) => (
              <div
                key={s.id}
                title={s.name}
                className='flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold text-foreground ring-1 ring-border'
              >
                {s.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>

        <div className='space-y-2 border-t pt-3'>
          <Button asChild variant='default' size='sm' className='w-full'>
            <Link to='/admin/users'>
              {t('kpi.allSellersBtn')}
            </Link>
          </Button>
          <Button asChild variant='outline' size='sm' className='w-full text-rose-600 hover:text-rose-700'>
            <Link to='/admin/users'>
              {t('kpi.pendingSellersBtn')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
