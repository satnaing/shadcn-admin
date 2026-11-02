import { useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import type { GlobalSeoConfig } from './data/analytics.type'
import { useGlobalSeoConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

function SeoForm({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: GlobalSeoConfig
  onSave: (d: GlobalSeoConfig) => void
  isPending: boolean
}) {
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title ?? 'xShop — Onlayn Alış-Veriş Mərkəzi')
  const [metaDesc, setMetaDesc] = useState(
    initialData?.meta_description ?? 'Azərbaycanın ən böyük onlayn ticarət və çatdırılma platforması.'
  )
  const [metaKeywords, setMetaKeywords] = useState(initialData?.meta_keywords ?? 'xshop, e-commerce, alış-veriş, elektronika, geyim')
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonical_url ?? 'https://xshop.az')
  const [ogImage, setOgImage] = useState(initialData?.og_image ?? 'https://xshop.az/og-image.jpg')
  const [twitterCard, setTwitterCard] = useState<GlobalSeoConfig['twitter_card_type']>(
    initialData?.twitter_card_type ?? 'summary_large_image'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      meta_title: metaTitle,
      meta_description: metaDesc,
      meta_keywords: metaKeywords,
      canonical_url: canonicalUrl,
      og_image: ogImage,
      twitter_card_type: twitterCard,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-3 max-w-5xl'>
      <div className='lg:col-span-2 space-y-6'>
        <Card>
          <CardHeader><CardTitle className='text-base'>Əsas Meta Teqlər</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-1.5'>
              <Label>Qlobal Meta Başlıq (Title)</Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} required />
            </div>
            <div className='space-y-1.5'>
              <Label>Qlobal Meta Təsvir (Description)</Label>
              <Textarea rows={3} value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} required />
            </div>
            <div className='space-y-1.5'>
              <Label>Açar Sözlər (Keywords, vergüllə ayırın)</Label>
              <Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} />
            </div>
            <div className='space-y-1.5'>
              <Label>Əsas Domen URL (Canonical URL)</Label>
              <Input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder='https://xshop.az' required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className='text-base'>Sosial Şəbəkə Paylaşımı (OpenGraph / Twitter)</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-1.5'>
              <Label>OG Paylaşım Şəkli (URL)</Label>
              <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder='https://...' />
            </div>
            <div className='space-y-1.5'>
              <Label>Twitter Card Növü</Label>
              <Select value={twitterCard} onValueChange={(v) => setTwitterCard(v as GlobalSeoConfig['twitter_card_type'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='summary_large_image'>Böyük Şəkil (summary_large_image)</SelectItem>
                  <SelectItem value='summary'>Kiçik Şəkil (summary)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-6'>
        <Card>
          <CardHeader><CardTitle className='text-base'>Google Axtarış Nəticəsi Baxışı</CardTitle></CardHeader>
          <CardContent className='space-y-2'>
            <div className='rounded-lg border bg-muted/40 p-3 space-y-1'>
              <p className='text-xs text-muted-foreground truncate'>{canonicalUrl}</p>
              <p className='text-sm font-semibold text-blue-600 line-clamp-1 hover:underline cursor-pointer'>{metaTitle}</p>
              <p className='text-xs text-muted-foreground line-clamp-2'>{metaDesc}</p>
            </div>
            <Button type='submit' className='w-full mt-4' disabled={isPending}>
              {isPending ? 'Saxlanılır...' : 'SEO Parametrlərini Saxla'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

export function GlobalSeoPage() {
  const { data: config, isLoading } = useGlobalSeoConfig()
  const { saveGlobalSeo } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Qlobal SEO Parametrləri</h1>
          <p className='text-sm text-muted-foreground'>
            Axtarış motorları və sosial şəbəkələr üçün əsas meta məlumatlar
          </p>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <SeoForm
            key={config ? 'loaded' : 'loading'}
            initialData={config}
            onSave={(d) => saveGlobalSeo.mutate(d)}
            isPending={saveGlobalSeo.isPending}
          />
        )}
      </Main>
    </>
  )
}
