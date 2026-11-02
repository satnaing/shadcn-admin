import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Globe } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { MetaPixelConfig } from './data/analytics.type'
import { usePixelConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

function PixelForm({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: MetaPixelConfig
  onSave: (d: MetaPixelConfig) => void
  isPending: boolean
}) {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? false)
  const [pixelId, setPixelId] = useState(initialData?.pixel_id ?? '')
  const [trackPageView, setTrackPageView] = useState(initialData?.track_page_view ?? true)
  const [trackAddToCart, setTrackAddToCart] = useState(initialData?.track_add_to_cart ?? true)
  const [trackCheckout, setTrackCheckout] = useState(initialData?.track_initiate_checkout ?? true)
  const [trackPurchase, setTrackPurchase] = useState(initialData?.track_purchase ?? true)
  const [trackSearch, setTrackSearch] = useState(initialData?.track_search ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      enabled,
      pixel_id: pixelId,
      track_page_view: trackPageView,
      track_add_to_cart: trackAddToCart,
      track_initiate_checkout: trackCheckout,
      track_purchase: trackPurchase,
      track_search: trackSearch,
    })
  }

  const events = [
    { label: 'PageView (Səhifə Baxışı)', state: trackPageView, setState: setTrackPageView },
    { label: 'AddToCart (Səbətə Əlavə)', state: trackAddToCart, setState: setTrackAddToCart },
    { label: 'InitiateCheckout (Ödənişə Başlama)', state: trackCheckout, setState: setTrackCheckout },
    { label: 'Purchase (Uğurlu Satış)', state: trackPurchase, setState: setTrackPurchase },
    { label: 'Search (Məhsul Axtarışı)', state: trackSearch, setState: setTrackSearch },
  ]

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Meta (Facebook) Pixel</CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>Pixel İdentifikatoru (Pixel ID)</Label>
            <Input
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              placeholder='123456789012345'
              required={enabled}
            />
          </div>

          <div className='space-y-3 border-t pt-4'>
            <Label className='text-sm font-semibold'>İzlənən Hadisələr</Label>
            {events.map((ev) => (
              <div key={ev.label} className='flex items-center justify-between'>
                <span className='text-xs text-muted-foreground'>{ev.label}</span>
                <Switch checked={ev.state} onCheckedChange={ev.setState} />
              </div>
            ))}
          </div>

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

export function MetaPixelPage() {
  const { data: config, isLoading } = usePixelConfig()
  const { savePixel } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div className='flex items-center justify-between max-w-2xl'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Meta Pixel</h1>
            <p className='text-sm text-muted-foreground'>
              Facebook və Instagram reklamları üçün brauzer pikselləri
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link to='/admin/analytics/conversions-api'>
              <Globe className='mr-2 h-4 w-4' /> Conversions API
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <PixelForm
            key={config ? 'loaded' : 'loading'}
            initialData={config}
            onSave={(d) => savePixel.mutate(d)}
            isPending={savePixel.isPending}
          />
        )}
      </Main>
    </>
  )
}
