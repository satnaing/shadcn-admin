import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface PublishCardProps {
  published: boolean
  onPublishedChange: (v: boolean) => void
  featured: boolean
  onFeaturedChange: (v: boolean) => void
  todaysDeal: boolean
  onTodaysDealChange: (v: boolean) => void
  isSubmitting?: boolean
  onCancel: () => void
}

export function ProductPublishCard({
  published,
  onPublishedChange,
  featured,
  onFeaturedChange,
  todaysDeal,
  onTodaysDealChange,
  isSubmitting,
  onCancel,
}: PublishCardProps) {
  const { t } = useTranslation('products')

  return (
    <Card className='sticky top-4'>
      <CardHeader>
        <CardTitle className='text-base'>{t('form.statusSettings', 'Nəşr və Vəziyyət')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between rounded-lg border p-3'>
          <div>
            <Label className='cursor-pointer text-sm font-medium'>
              {t('table.published', 'Saytda Nəşr Edilsin')}
            </Label>
            <div className='text-xs text-muted-foreground'>Aktiv olduqda vitrində görünür</div>
          </div>
          <Switch checked={published} onCheckedChange={onPublishedChange} />
        </div>

        <div className='flex items-center justify-between rounded-lg border p-3'>
          <div>
            <Label className='cursor-pointer text-sm font-medium'>
              {t('table.featured', 'Seçilmiş Məhsul (Featured)')}
            </Label>
            <div className='text-xs text-muted-foreground'>Ana səhifə bloklarında vurğulanır</div>
          </div>
          <Switch checked={featured} onCheckedChange={onFeaturedChange} />
        </div>

        <div className='flex items-center justify-between rounded-lg border p-3'>
          <div>
            <Label className='cursor-pointer text-sm font-medium'>
              Günün Təklifi (Today's Deal)
            </Label>
            <div className='text-xs text-muted-foreground'>Xüsusi günün endirimləri bölməsində çıxır</div>
          </div>
          <Switch checked={todaysDeal} onCheckedChange={onTodaysDealChange} />
        </div>

        <div className='pt-2 space-y-2'>
          <Button type='submit' className='w-full gap-2' disabled={isSubmitting}>
            <Save className='size-4' />
            {isSubmitting ? t('common.saving', 'Yadda saxlanılır...') : t('common.saveProduct', 'Məhsulu Yarat')}
          </Button>
          <Button variant='outline' type='button' className='w-full' onClick={onCancel}>
            {t('dialog.cancel', 'Ləğv et')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
