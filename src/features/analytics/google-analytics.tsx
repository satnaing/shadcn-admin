import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Activity } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { GoogleAnalyticsConfig } from './data/analytics.type'
import { useGa4Config } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

function Ga4Form({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: GoogleAnalyticsConfig
  onSave: (d: GoogleAnalyticsConfig) => void
  isPending: boolean
}) {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? false)
  const [measurementId, setMeasurementId] = useState(initialData?.measurement_id ?? '')
  const [enhancedEcommerce, setEnhancedEcommerce] = useState(initialData?.enhanced_ecommerce ?? true)
  const [debugMode, setDebugMode] = useState(initialData?.debug_mode ?? false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      enabled,
      measurement_id: measurementId,
      enhanced_ecommerce: enhancedEcommerce,
      debug_mode: debugMode,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Google Analytics 4 (GA4)</CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>Ölçmə İdentifikatoru (Measurement ID)</Label>
            <Input
              value={measurementId}
              onChange={(e) => setMeasurementId(e.target.value)}
              placeholder='G-XXXXXXXXXX'
              required={enabled}
            />
            <p className='text-xs text-muted-foreground'>
              Google Analytics Data Stream bölməsindən əldə etdiyiniz G- ilə başlayan identifikator.
            </p>
          </div>

          <div className='flex items-center justify-between border-t pt-4'>
            <div className='space-y-0.5'>
              <Label>Təkmilləşdirilmiş E-ticarət Hadisələri</Label>
              <p className='text-xs text-muted-foreground'>
                view_item, add_to_cart, begin_checkout və purchase hadisələrinin avtomatik göndərişi.
              </p>
            </div>
            <Switch checked={enhancedEcommerce} onCheckedChange={setEnhancedEcommerce} />
          </div>

          <div className='flex items-center justify-between border-t pt-4'>
            <div className='space-y-0.5'>
              <Label>Debug / Test Rejimi</Label>
              <p className='text-xs text-muted-foreground'>
                GA4 DebugView üçün debug_mode parametrini aktiv edin.
              </p>
            </div>
            <Switch checked={debugMode} onCheckedChange={setDebugMode} />
          </div>

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

export function GoogleAnalyticsPage() {
  const { data: config, isLoading } = useGa4Config()
  const { saveGa4 } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div className='flex items-center justify-between max-w-2xl'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Google Analytics (GA4)</h1>
            <p className='text-sm text-muted-foreground'>
              İstifadəçi davranışı və e-ticarət hadisələrinin izlənməsi
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link to='/admin/analytics/google-reports'>
              <Activity className='mr-2 h-4 w-4' /> Test Hesabatı
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <Ga4Form
            key={config ? 'loaded' : 'loading'}
            initialData={config}
            onSave={(d) => saveGa4.mutate(d)}
            isPending={saveGa4.isPending}
          />
        )}
      </Main>
    </>
  )
}
