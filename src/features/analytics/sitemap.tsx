import { useState } from 'react'
import { Copy, ExternalLink, RefreshCw } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { SitemapConfig } from './data/analytics.type'
import { useSitemapConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

function SitemapForm({
  initialData, onSave, onGenerate, isPending, isGenerating,
}: {
  initialData?: SitemapConfig
  onSave: (d: SitemapConfig) => void
  onGenerate: () => void
  isPending: boolean
  isGenerating: boolean
}) {
  const [autoGen, setAutoGen] = useState(initialData?.auto_generate ?? true)
  const [frequency, setFrequency] = useState<SitemapConfig['frequency']>(initialData?.frequency ?? 'daily')
  const [incProducts, setIncProducts] = useState(initialData?.include_products ?? true)
  const [incCats, setIncCats] = useState(initialData?.include_categories ?? true)
  const [incBrands, setIncBrands] = useState(initialData?.include_brands ?? true)
  const [incPages, setIncPages] = useState(initialData?.include_pages ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      auto_generate: autoGen, frequency,
      include_products: incProducts, include_categories: incCats,
      include_brands: incBrands, include_pages: incPages,
      sitemap_url: initialData?.sitemap_url ?? 'https://xshop.az/sitemap.xml',
      last_generated_at: initialData?.last_generated_at ?? '',
      urls_count: initialData?.urls_count ?? 0,
    })
  }

  return (
    <div className='max-w-2xl space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-base'>Sitemap.xml Faylı</CardTitle>
            <Badge variant='outline'>{initialData?.urls_count ?? 0} URL indekslənib</Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Input value={initialData?.sitemap_url ?? 'https://xshop.az/sitemap.xml'} readOnly className='bg-muted font-mono text-xs' />
            <Button variant='outline' size='icon' onClick={() => navigator.clipboard.writeText(initialData?.sitemap_url ?? '')}>
              <Copy className='h-4 w-4' />
            </Button>
            <Button variant='outline' size='icon' asChild>
              <a href={initialData?.sitemap_url ?? '#'} target='_blank' rel='noreferrer'><ExternalLink className='h-4 w-4' /></a>
            </Button>
          </div>
          <div className='flex items-center justify-between text-xs text-muted-foreground pt-1'>
            <span>Son generasiya: <b>{initialData?.last_generated_at ?? '—'}</b></span>
            <Button size='sm' onClick={onGenerate} disabled={isGenerating}>
              <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              İndi Yenidən Yarat
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle className='text-base'>Avtomatik Generasiya Tənzimləmələri</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Label>Dövri avtomatik yenilənmə</Label>
              <Switch checked={autoGen} onCheckedChange={setAutoGen} />
            </div>

            <div className='space-y-1.5'>
              <Label>Yenilənmə Tezliyi</Label>
              <Select value={frequency} onValueChange={(v) => setFrequency(v as SitemapConfig['frequency'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='daily'>Gündəlik (Hər gecə)</SelectItem>
                  <SelectItem value='weekly'>Həftəlik</SelectItem>
                  <SelectItem value='monthly'>Aylıq</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2 border-t pt-3'>
              <Label className='text-xs font-semibold'>Sitemapa daxil edilən bölmələr</Label>
              <div className='flex items-center justify-between'><span className='text-xs text-muted-foreground'>Bütün aktiv məhsullar</span><Switch checked={incProducts} onCheckedChange={setIncProducts} /></div>
              <div className='flex items-center justify-between'><span className='text-xs text-muted-foreground'>Məhsul kateqoriyaları</span><Switch checked={incCats} onCheckedChange={setIncCats} /></div>
              <div className='flex items-center justify-between'><span className='text-xs text-muted-foreground'>Brend səhifələri</span><Switch checked={incBrands} onCheckedChange={setIncBrands} /></div>
              <div className='flex items-center justify-between'><span className='text-xs text-muted-foreground'>Statik CMS səhifələri</span><Switch checked={incPages} onCheckedChange={setIncPages} /></div>
            </div>

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? 'Saxlanılır...' : 'Parametrləri Saxla'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export function SitemapPage() {
  const { data: config, isLoading } = useSitemapConfig()
  const { saveSitemap, generateSitemap } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Sayt Xəritəsi (Sitemap Generator)</h1>
          <p className='text-sm text-muted-foreground'>Google və digər axtarış motorları üçün XML sayt xəritəsi</p>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <SitemapForm
            key={config ? 'loaded' : 'loading'}
            initialData={config}
            onSave={(d) => saveSitemap.mutate(d)}
            onGenerate={() => generateSitemap.mutate()}
            isPending={saveSitemap.isPending}
            isGenerating={generateSitemap.isPending}
          />
        )}
      </Main>
    </>
  )
}
