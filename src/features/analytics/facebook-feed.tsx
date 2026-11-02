import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { FeedCopyCard } from './components/feed-copy-card'
import { useFbCatalogConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

export function FacebookFeedPage() {
  const { data: config, isLoading } = useFbCatalogConfig()
  const { generateFbCatalogFeed } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='max-w-3xl space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Facebook Məhsul Kataloq Feedi</h1>
            <p className='text-sm text-muted-foreground'>
              Meta Commerce Manager "Data feeds" bölməsinə yüklənəcək canlı məhsul cədvəli
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link to='/admin/analytics/facebook-catalogue'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Kataloq Ayarları
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <FeedCopyCard
            title='Facebook Product Catalog Feed'
            description='Bu keçidi Meta Commerce Manager daxilində "Catalogue → Data sources → Data feeds" bölməsinə əlavə edin.'
            feedUrl={config?.feed_url ?? 'https://xshop.az/feeds/facebook-catalog.csv'}
            format={config?.feed_format ?? 'CSV'}
            lastSyncedAt={config?.last_synced_at}
            totalProducts={config?.total_products_synced ?? 0}
            onRegenerate={() => generateFbCatalogFeed.mutate()}
            isRegenerating={generateFbCatalogFeed.isPending}
          />
        )}
      </Main>
    </>
  )
}
