import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Rss } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { FacebookCatalogConfig } from './data/analytics.type'
import { useFbCatalogConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

function FbCatalogForm({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: FacebookCatalogConfig
  onSave: (d: FacebookCatalogConfig) => void
  isPending: boolean
}) {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? false)
  const [catalogId, setCatalogId] = useState(initialData?.catalog_id ?? '')
  const [feedFormat, setFeedFormat] = useState<FacebookCatalogConfig['feed_format']>(
    initialData?.feed_format ?? 'csv'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      enabled,
      catalog_id: catalogId,
      feed_format: feedFormat,
      feed_url: initialData?.feed_url ?? 'https://xshop.az/feeds/facebook-catalog.csv',
      total_products_synced: initialData?.total_products_synced ?? 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Facebook / Meta Kataloq</CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>Kataloq İdentifikatoru (Catalog ID)</Label>
            <Input
              value={catalogId}
              onChange={(e) => setCatalogId(e.target.value)}
              placeholder='987654321098765'
              required={enabled}
            />
          </div>

          <div className='space-y-1.5'>
            <Label>Feed Formatı</Label>
            <Select
              value={feedFormat}
              onValueChange={(v) => setFeedFormat(v as FacebookCatalogConfig['feed_format'])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value='csv'>CSV (Vergüllə ayrılmış)</SelectItem>
                <SelectItem value='xml'>XML (RSS 2.0)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

export function FacebookCataloguePage() {
  const { data: config, isLoading } = useFbCatalogConfig()
  const { saveFbCatalog } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div className='flex items-center justify-between max-w-2xl'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Facebook Kataloq</h1>
            <p className='text-sm text-muted-foreground'>
              Meta Commerce Manager və Instagram Shop üçün məhsul kataloqu
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link to='/admin/analytics/facebook-catalogue/feed'>
              <Rss className='mr-2 h-4 w-4' /> Feed Faylı
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <FbCatalogForm
            key={config ? 'loaded' : 'loading'}
            initialData={config}
            onSave={(d) => saveFbCatalog.mutate(d)}
            isPending={saveFbCatalog.isPending}
          />
        )}
      </Main>
    </>
  )
}
