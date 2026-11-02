import { useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CustomScriptsConfig } from './data/analytics.type'
import { useCustomScriptsConfig } from './hooks/useAnalytics'
import { useAnalyticsMutations } from './hooks/useAnalyticsMutations'

function ScriptsForm({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: CustomScriptsConfig
  onSave: (d: CustomScriptsConfig) => void
  isPending: boolean
}) {
  const [headerScripts, setHeaderScripts] = useState(initialData?.header_scripts ?? '')
  const [bodyScripts, setBodyScripts] = useState(initialData?.body_scripts ?? '')
  const [footerScripts, setFooterScripts] = useState(initialData?.footer_scripts ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      header_scripts: headerScripts,
      body_scripts: bodyScripts,
      footer_scripts: footerScripts,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-3xl space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Header Skriptləri (&lt;head&gt;)</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Label className='text-xs text-muted-foreground'>
            Saytın &lt;head&gt; bölməsinə yerləşdiriləcək xarici JS teqləri və ya CSS kodları
          </Label>
          <Textarea
            rows={5}
            value={headerScripts}
            onChange={(e) => setHeaderScripts(e.target.value)}
            className='font-mono text-xs'
            placeholder='<script>...</script>'
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Body Skriptləri (&lt;body&gt; əvvəli)</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Label className='text-xs text-muted-foreground'>
            &lt;body&gt; teqinin dərhal açılışından sonra icra olunacaq skriptlər (məs. GTM noscript)
          </Label>
          <Textarea
            rows={4}
            value={bodyScripts}
            onChange={(e) => setBodyScripts(e.target.value)}
            className='font-mono text-xs'
            placeholder='<noscript>...</noscript>'
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Footer Skriptləri (&lt;/body&gt; sonu)</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Label className='text-xs text-muted-foreground'>
            Canlı çat widgetləri (Tawk.to, WhatsApp bot) və ya digər analitika vidjetləri
          </Label>
          <Textarea
            rows={5}
            value={footerScripts}
            onChange={(e) => setFooterScripts(e.target.value)}
            className='font-mono text-xs'
            placeholder='<!-- LiveChat widget -->'
          />
        </CardContent>
      </Card>

      <Button type='submit' className='w-full' disabled={isPending}>
        {isPending ? 'Saxlanılır...' : 'Skriptləri Yadda Saxla'}
      </Button>
    </form>
  )
}

export function CustomScriptsPage() {
  const { data: config, isLoading } = useCustomScriptsConfig()
  const { saveCustomScripts } = useAnalyticsMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-6 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Fərdi Skriptlər</h1>
          <p className='text-sm text-muted-foreground'>
            Veb-saytın kod strukturuna xarici izləmə və ya köməkçi skriptlər əlavə edin
          </p>
        </div>

        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <ScriptsForm
            key={config ? 'loaded' : 'loading'}
            initialData={config}
            onSave={(d) => saveCustomScripts.mutate(d)}
            isPending={saveCustomScripts.isPending}
          />
        )}
      </Main>
    </>
  )
}
