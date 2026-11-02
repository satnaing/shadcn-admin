import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { ConversionsApiConfig } from './data/analytics.type'
import { useCapiConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

function CapiForm({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: ConversionsApiConfig
  onSave: (d: ConversionsApiConfig) => void
  isPending: boolean
}) {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? false)
  const [datasetId, setDatasetId] = useState(initialData?.dataset_id ?? '')
  const [accessToken, setAccessToken] = useState(initialData?.access_token ?? '')
  const [testEventCode, setTestEventCode] = useState(initialData?.test_event_code ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      enabled,
      dataset_id: datasetId,
      access_token: accessToken,
      test_event_code: testEventCode,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base'>Meta Conversions API (CAPI)</CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-1.5'>
            <Label>Dataset / Pixel ID</Label>
            <Input
              value={datasetId}
              onChange={(e) => setDatasetId(e.target.value)}
              placeholder='123456789012345'
              required={enabled}
            />
          </div>

          <div className='space-y-1.5'>
            <Label>Sistem İstifadəçisi Access Token</Label>
            <Input
              type='password'
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder='EAAG...'
              required={enabled}
            />
            <p className='text-xs text-muted-foreground'>
              Meta Business Manager Events Manager bölməsindən yaradılmış daimi giriş tokeni.
            </p>
          </div>

          <div className='space-y-1.5'>
            <Label>Test Hadisə Kodu (Test Event Code - Könüllü)</Label>
            <Input
              value={testEventCode}
              onChange={(e) => setTestEventCode(e.target.value)}
              placeholder='TEST12345'
            />
            <p className='text-xs text-muted-foreground'>
              Events Manager daxilində "Test Events" sekmesindəki kod (sınaq bitdikdən sonra boş buraxın).
            </p>
          </div>

          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Saxlanılır...' : 'Yadda Saxla'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

export function ConversionsApiPage() {
  const { data: config, isLoading } = useCapiConfig()
  const { saveCapi } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div className='flex items-center justify-between max-w-2xl'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Meta Conversions API</h1>
            <p className='text-sm text-muted-foreground'>
              AdBlocker və iOS məxfilik məhdudiyyətlərini aşmaq üçün server-tərəfli izləmə
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link to='/admin/analytics/pixel'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Brauzer Pikseli
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <CapiForm
            key={config ? 'loaded' : 'loading'}
            initialData={config}
            onSave={(d) => saveCapi.mutate(d)}
            isPending={saveCapi.isPending}
          />
        )}
      </Main>
    </>
  )
}
