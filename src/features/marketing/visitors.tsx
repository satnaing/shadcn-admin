import { useState } from 'react'
import { Eye } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { VisitorSimulatorSettings } from './data/marketing.type'
import { useVisitorSettings } from './hooks/useMarketing'
import { useMarketingMutations } from './hooks/useMarketingMutations'

function VisitorForm({
  initialData,
  onSave,
  isPending,
}: {
  initialData?: VisitorSimulatorSettings
  onSave: (d: Partial<VisitorSimulatorSettings>) => void
  isPending: boolean
}) {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? false)
  const [minVisitors, setMinVisitors] = useState(initialData?.min_visitors ?? 5)
  const [maxVisitors, setMaxVisitors] = useState(initialData?.max_visitors ?? 45)
  const [multiplier, setMultiplier] = useState(initialData?.multiplier ?? 1.5)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      enabled,
      min_visitors: Number(minVisitors),
      max_visitors: Number(maxVisitors),
      multiplier: Number(multiplier),
    })
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Eye className='h-4 w-4' /> Məhsul Səhifəsi Ziyarətçi Sayğacı
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-xs text-muted-foreground'>
            Məhsul səhifələrində "İndicə bu məhsula X nəfər baxır" dinamik sayğacını tənzimləyin.
          </p>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <Label>Minimum Ziyarətçi Sayı</Label>
              <Input
                type='number'
                value={minVisitors}
                onChange={(e) => setMinVisitors(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className='space-y-1.5'>
              <Label>Maksimum Ziyarətçi Sayı</Label>
              <Input
                type='number'
                value={maxVisitors}
                onChange={(e) => setMaxVisitors(Number(e.target.value))}
                min={2}
              />
            </div>
          </div>
          <div className='space-y-1.5'>
            <Label>Çoxaldıcı Əmsal (Multiplier)</Label>
            <Input
              type='number'
              step='0.1'
              value={multiplier}
              onChange={(e) => setMultiplier(Number(e.target.value))}
            />
          </div>
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Saxlanılır...' : 'Parametrləri Yadda Saxla'}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

export function VisitorsPage() {
  const { data: settings, isLoading } = useVisitorSettings()
  const { saveVisitorSettings } = useMarketingMutations()

  return (
    <>
      <AdminHeader />
      <Main className='p-6 space-y-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Fərdi Məhsul Ziyarətçiləri</h1>
          <p className='text-sm text-muted-foreground'>
            Məhsul səhifəsində canlı istifadəçi sayğacı simulyasiyası
          </p>
        </div>
        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <VisitorForm
            key={settings ? 'loaded' : 'loading'}
            initialData={settings}
            onSave={(d) => saveVisitorSettings.mutate(d)}
            isPending={saveVisitorSettings.isPending}
          />
        )}
      </Main>
    </>
  )
}
