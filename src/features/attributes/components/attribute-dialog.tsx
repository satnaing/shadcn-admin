import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AttributeFormData, AttributeItem } from '../data/attributes.type'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: AttributeItem | null
  onSubmit: (data: AttributeFormData) => Promise<void>
  isSubmitting?: boolean
}

export function AttributeDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const { t } = useTranslation('catalog')

  const [name, setName] = useState(initialData?.name ?? '')
  const [valuesStr, setValuesStr] = useState(initialData?.values.join(', ') ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const values = valuesStr
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean)

    await onSubmit({
      name,
      values,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t('attributes.dialog.editTitle')
              : t('attributes.dialog.createTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='attr-name'>{t('attributes.dialog.nameLabel')}</Label>
            <Input
              id='attr-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='attr-values'>{t('attributes.dialog.valuesLabel')}</Label>
            <Input
              id='attr-values'
              value={valuesStr}
              onChange={(e) => setValuesStr(e.target.value)}
              placeholder='S, M, L, XL'
            />
          </div>

          <DialogFooter className='pt-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              {t('attributes.dialog.cancel')}
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {t('attributes.dialog.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
