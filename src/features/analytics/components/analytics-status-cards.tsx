import { Activity, BarChart2, CheckCircle2, Eye, Globe, Share2, ShoppingBag, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { AnalyticsOverview } from '../data/analytics.type'

interface Props {
  overview?: AnalyticsOverview
}

export function AnalyticsStatusCards({ overview }: Props) {
  const items = [
    { name: 'Google Analytics 4', enabled: overview?.ga4_enabled, icon: BarChart2 },
    { name: 'Google Tag Manager', enabled: overview?.gtm_enabled, icon: Activity },
    { name: 'Meta Pixel', enabled: overview?.pixel_enabled, icon: Share2 },
    { name: 'Conversion API', enabled: overview?.capi_enabled, icon: Globe },
    { name: 'Google Merchant', enabled: overview?.gmc_enabled, icon: ShoppingBag },
    { name: 'Facebook Kataloq', enabled: overview?.fb_catalog_enabled, icon: Share2 },
  ]

  return (
    <div className='space-y-4'>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardContent className='flex items-center justify-between p-4'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Bugünkü Baxışlar</p>
              <p className='mt-1 text-2xl font-bold'>
                {(overview?.pageviews_today ?? 0).toLocaleString()}
              </p>
            </div>
            <Eye className='h-6 w-6 text-primary' />
          </CardContent>
        </Card>
        <Card>
          <CardContent className='flex items-center justify-between p-4'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Bugünkü İzlənən Hadisələr</p>
              <p className='mt-1 text-2xl font-bold'>
                {(overview?.total_events_today ?? 0).toLocaleString()}
              </p>
            </div>
            <Activity className='h-6 w-6 text-emerald-500' />
          </CardContent>
        </Card>
        <Card>
          <CardContent className='flex items-center justify-between p-4'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Sitemap Son Yenilənmə</p>
              <p className='mt-1 text-sm font-semibold'>
                {overview?.sitemap_last_generated ?? '—'}
              </p>
            </div>
            <Globe className='h-6 w-6 text-blue-500' />
          </CardContent>
        </Card>
        <Card>
          <CardContent className='flex items-center justify-between p-4'>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Aktiv İnteqrasiyalar</p>
              <p className='mt-1 text-2xl font-bold text-emerald-600'>
                {items.filter((i) => i.enabled).length} / {items.length}
              </p>
            </div>
            <CheckCircle2 className='h-6 w-6 text-emerald-500' />
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'>
        {items.map((i) => {
          const Icon = i.icon
          return (
            <div
              key={i.name}
              className='flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm'
            >
              <div className='flex items-center gap-2'>
                <Icon className='h-4 w-4 text-muted-foreground' />
                <span className='text-xs font-medium'>{i.name}</span>
              </div>
              {i.enabled ? (
                <CheckCircle2 className='h-4 w-4 text-emerald-500' />
              ) : (
                <XCircle className='h-4 w-4 text-muted-foreground' />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
