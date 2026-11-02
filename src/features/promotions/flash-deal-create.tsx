import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { usePromotionMutations } from './hooks/usePromotions'

export function FlashDealCreate() {
  const { t } = useTranslation('promotions')
  const navigate = useNavigate()
  const { saveFlashDealMutation } = usePromotionMutations()

  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('2026-11-05')
  const [endDate, setEndDate] = useState('2026-11-12')
  const [bgColor, setBgColor] = useState('#e11d48')
  const [banner, setBanner] = useState('')
  const [featured, setFeatured] = useState(true)
  const [status, setStatus] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveFlashDealMutation.mutate(
      {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        start_date: startDate,
        end_date: endDate,
        background_color: bgColor,
        banner: banner || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
        featured,
        status,
        products_count: 0,
      },
      {
        onSuccess: () => {
          toast.success(t('messages.dealCreated', 'Flash satış uğurla yaradıldı!'))
          void navigate({ to: '/admin/promotions/flash-deals' })
        },
      }
    )
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='icon' onClick={() => void navigate({ to: '/admin/promotions/flash-deals' })}>
            <ArrowLeft className='size-4' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>{t('deals.addNew', 'Yeni Flash Satış Yarat')}</h1>
            <p className='text-xs text-muted-foreground'>Müddətli aksiya və kampaniya parametrləri</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='max-w-2xl space-y-4'>
          <Card>
            <CardHeader><CardTitle className='text-base'>Kampaniya Parametrləri</CardTitle></CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1.5'>
                <Label htmlFor='fd-title'>Kampaniyanın Başlığı *</Label>
                <Input id='fd-title' required value={title} onChange={(e) => setTitle(e.target.value)} placeholder='məs. Qara Cümə Super Endirimləri' />
              </div>

              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='fd-start'>Başlama Tarixi *</Label>
                  <Input id='fd-start' type='date' required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='fd-end'>Bitmə Tarixi *</Label>
                  <Input id='fd-end' type='date' required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='fd-bg'>Fon Rəngi (HEX)</Label>
                  <Input id='fd-bg' value={bgColor} onChange={(e) => setBgColor(e.target.value)} placeholder='#e11d48' />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='fd-banner'>Banner Şəkil URL</Label>
                  <Input id='fd-banner' value={banner} onChange={(e) => setBanner(e.target.value)} placeholder='https://...' />
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <div className='text-sm font-medium'>Seçilmiş Kampaniya (Featured)</div>
                  <div className='text-xs text-muted-foreground'>Saytın yuxarı hissəsində vurğulansın</div>
                </div>
                <Switch checked={featured} onCheckedChange={setFeatured} />
              </div>

              <div className='flex items-center justify-between rounded-lg border p-3'>
                <div>
                  <div className='text-sm font-medium'>Aktiv Status</div>
                  <div className='text-xs text-muted-foreground'>Kampaniya dərhal qüvvəyə minsin</div>
                </div>
                <Switch checked={status} onCheckedChange={setStatus} />
              </div>
            </CardContent>
          </Card>

          <div className='flex justify-end gap-3'>
            <Button variant='outline' type='button' onClick={() => void navigate({ to: '/admin/promotions/flash-deals' })}>
              {t('dialog.cancel', 'Ləğv et')}
            </Button>
            <Button type='submit' className='gap-2' disabled={saveFlashDealMutation.isPending}>
              <Save className='size-4' />
              {t('dialog.save', 'Yadda saxla')}
            </Button>
          </div>
        </form>
      </Main>
    </>
  )
}

export default FlashDealCreate
