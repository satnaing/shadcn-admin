import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Rss } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { MerchantCenterConfig } from './data/analytics.type'
import { useGmcConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

function GmcForm({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: MerchantCenterConfig
  onSave: (d: MerchantCenterConfig) => void
  isPending: boolean
}) {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? false)
  const [merchantId, setMerchantId] = useState(initialData?.merchant_id ?? '')
  const [targetCountry, setTargetCountry] = useState(initialData?.target_country ?? 'AZ')
  const [targetCurrency, setTargetCurrency] = useState(initialData?.target_currency ?? 'AZN')
  const [includeOutOfStock, setIncludeOutOfStock] = useState(initialData?.include_out_of_stock ?? false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      enabled,
      merchant_id: merchantId,
      target_country: targetCountry,
      target_currency: targetCurrency,
      include_out_of_stock: includeOutOfStock,
      feed_url: initialData?.feed_url ?? 'https://xshop.az/feeds/google-merchant.xml',
      total_products_synced: initialData?.total_products_synced ?? 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Google Merchant Center</CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>Merchant İdentifikatoru (Merchant ID)</Label>
            <Input
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              placeholder='123456789'
              required={enabled}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label>Hədəf Ölkə (ISO Kodu)</Label>
              <Input
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value.toUpperCase())}
                placeholder='AZ'
                required
              />
            </div>
            <div className='space-y-1.5'>
              <Label>Valyuta</Label>
              <Input
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value.toUpperCase())}
                placeholder='AZN'
                required
              />
            </div>
          </div>

          <div className='flex items-center justify-between border-t pt-4'>
            <div className='space-y-0.5'>
              <Label>Tükənmiş məhsullar daxil edilsin</Label>
              <p className='text-xs text-muted-foreground'>
                Stokda qalmayan məhsullar feed faylına əlavə olunsun.
              </p>
            </div>
            <Switch checked={includeOutOfStock} onCheckedChange={setIncludeOutOfStock} />
          </div>

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

export function GmcConfigPage() {
  const { data: config, isLoading } = useGmcConfig()
  const { saveGmc } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div className='flex items-center justify-between max-w-2xl'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Google Merchant Center</h1>
            <p className='text-sm text-muted-foreground'>
              Google Shopping və pulsuz məhsul siyahıları üçün inteqrasiya
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link to='/admin/analytics/gmc/feed'>
              <Rss className='mr-2 h-4 w-4' /> Feed Faylı
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <GmcForm
            key={config ? 'loaded' : 'loading'}
            initialData={config}
            onSave={(d) => saveGmc.mutate(d)}
            isPending={saveGmc.isPending}
          />
        )}
      </Main>
    </>
  )
}
