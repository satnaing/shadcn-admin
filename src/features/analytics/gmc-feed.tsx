import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { FeedCopyCard } from './components/feed-copy-card'
import { useGmcConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

export function GmcFeedPage() {
  const { data: config, isLoading } = useGmcConfig()
  const { generateGmcFeed } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='max-w-3xl space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Google Merchant XML Feed</h1>
            <p className='text-sm text-muted-foreground'>
              Google Merchant hesabına əlavə etmək üçün avtomatik yenilənən XML məhsul axını
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link to='/admin/analytics/gmc'>
              <ArrowLeft className='mr-2 h-4 w-4' /> GMC Ayarları
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <FeedCopyCard
            title='Google Merchant Product Feed'
            description='Bu URL-i Google Merchant Center daxilində "Feeds → Primary feeds" bölməsinə daxil edin.'
            feedUrl={config?.feed_url ?? 'https://xshop.az/feeds/google-merchant.xml'}
            format='XML / RSS 2.0'
            lastSyncedAt={config?.last_synced_at}
            totalProducts={config?.total_products_synced ?? 0}
            onRegenerate={() => generateGmcFeed.mutate()}
            isRegenerating={generateGmcFeed.isPending}
          />
        )}
      </Main>
    </>
  )
}
