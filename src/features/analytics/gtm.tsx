import { useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { GoogleTagManagerConfig } from './data/analytics.type'
import { useGtmConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

function GtmForm({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: GoogleTagManagerConfig
  onSave: (d: GoogleTagManagerConfig) => void
  isPending: boolean
}) {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? false)
  const [containerId, setContainerId] = useState(initialData?.container_id ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ enabled, container_id: containerId })
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Google Tag Manager (GTM)</CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>Konteyner İdentifikatoru (Container ID)</Label>
            <Input
              value={containerId}
              onChange={(e) => setContainerId(e.target.value)}
              placeholder='GTM-XXXXXXX'
              required={enabled}
            />
            <p className='text-xs text-muted-foreground'>
              GTM panelindən əldə etdiyiniz GTM- ilə başlayan konteyner kodu.
            </p>
          </div>

          <div className='rounded-md bg-muted/50 p-3 text-xs text-muted-foreground space-y-1'>
            <p>• GTM aktiv olduqda, müvafiq skriptlər saytın &lt;head&gt; və &lt;body&gt; teqlərinə avtomatik yerləşdirilir.</p>
            <p>• Digər üçüncü tərəf izləmə kodlarını GTM vasitəsilə mərkəzləşdirilmiş idarə edə bilərsiniz.</p>
          </div>

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

export function GtmPage() {
  const { data: config, isLoading } = useGtmConfig()
  const { saveGtm } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Google Tag Manager</h1>
          <p className='text-sm text-muted-foreground'>
            Teqlərin mərkəzləşdirilmiş idarə olunması üçün GTM konteyneri
          </p>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <GtmForm
            key={config ? 'loaded' : 'loading'}
            initialData={config}
            onSave={(d) => saveGtm.mutate(d)}
            isPending={saveGtm.isPending}
          />
        )}
      </Main>
    </>
  )
}
