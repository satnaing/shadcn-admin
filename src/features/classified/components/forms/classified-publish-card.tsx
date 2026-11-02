import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface PublishCardProps {
  isPublished: boolean
  onPublishedChange: (v: boolean) => void
  featured: boolean
  onFeaturedChange: (v: boolean) => void
  isSubmitting?: boolean
  onCancel: () => void
}

export function ClassifiedPublishCard({
  isPublished,
  onPublishedChange,
  featured,
  onFeaturedChange,
  isSubmitting,
  onCancel,
}: PublishCardProps) {
  const { t } = useTranslation('classified')

  return (
    <Card className='sticky top-4'>
      <CardHeader>
        <CardTitle className='text-base'>Nəşr Parametrləri</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between rounded-lg border p-3'>
          <div>
            <Label className='cursor-pointer text-sm font-medium'>
              {t('dialog.published', 'Dərhal Dərc Edilsin')}
            </Label>
            <div className='text-xs text-muted-foreground'>
              {t('dialog.publishedDesc', 'Aktiv olduqda elan vitrində dərhal görünür')}
            </div>
          </div>
          <Switch checked={isPublished} onCheckedChange={onPublishedChange} />
        </div>

        <div className='flex items-center justify-between rounded-lg border p-3'>
          <div>
            <Label className='cursor-pointer text-sm font-medium'>
              Seçilmiş Elan (Featured)
            </Label>
            <div className='text-xs text-muted-foreground'>
              Ana səhifədə və kateqoriya başında vurğulanır
            </div>
          </div>
          <Switch checked={featured} onCheckedChange={onFeaturedChange} />
        </div>

        <div className='pt-2 space-y-2'>
          <Button type='submit' className='w-full gap-2' disabled={isSubmitting}>
            <Save className='size-4' />
            {isSubmitting ? 'Yadda saxlanılır...' : t('dialog.save', 'Elanı Yadda Saxla')}
          </Button>
          <Button variant='outline' type='button' className='w-full' onClick={onCancel}>
            {t('dialog.cancel', 'Ləğv et')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
