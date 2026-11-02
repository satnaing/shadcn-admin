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
import { Switch } from '@/components/ui/switch'
import type { BrandFormData, BrandItem } from '../data/brands.type'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: BrandItem | null
  onSubmit: (data: BrandFormData) => Promise<void>
  isSubmitting?: boolean
}

export function BrandDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const { t } = useTranslation('catalog')

  const [name, setName] = useState(initialData?.name ?? '')
  const [top, setTop] = useState(Boolean(initialData?.top))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await onSubmit({
      name,
      top,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t('brands.dialog.editTitle')
              : t('brands.dialog.createTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='brand-name'>{t('brands.dialog.nameLabel')}</Label>
            <Input
              id='brand-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className='flex items-center justify-between pt-2'>
            <Label htmlFor='brand-top' className='cursor-pointer text-xs'>
              {t('brands.dialog.topLabel')}
            </Label>
            <Switch id='brand-top' checked={top} onCheckedChange={setTop} />
          </div>

          <DialogFooter className='pt-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              {t('brands.dialog.cancel')}
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {t('brands.dialog.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
