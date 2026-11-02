import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface DescCardProps {
  description: string
  onDescriptionChange: (v: string) => void
  tags: string
  onTagsChange: (v: string) => void
}

export function ClassifiedDescCard({
  description,
  onDescriptionChange,
  tags,
  onTagsChange,
}: DescCardProps) {
  const { t } = useTranslation('classified')

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{t('dialog.description', 'Elan Təsviri və Açar Sözlər')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='cp-desc'>Ətraflı Məlumat</Label>
          <Textarea
            id='cp-desc'
            rows={5}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder='Elan haqqında ətraflı məlumat, texniki vəziyyət, zəmanət və çatdırılma şərtləri...'
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='cp-tags'>Teqlər / Açar Sözlər (Vergüllə ayırın)</Label>
          <Input
            id='cp-tags'
            value={tags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder='elan, telefon, ikinci əl, zəmanətli'
          />
        </div>
      </CardContent>
    </Card>
  )
}
