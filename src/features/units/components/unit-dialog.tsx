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
import type { UnitFormData, UnitItem } from '../data/units.type'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: UnitItem | null
  onSubmit: (data: UnitFormData) => Promise<void>
  isSubmitting?: boolean
}

export function UnitDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const { t } = useTranslation('catalog')

  const [name, setName] = useState(initialData?.name ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await onSubmit({
      name,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t('units.dialog.editTitle')
              : t('units.dialog.createTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='unit-name'>{t('units.dialog.nameLabel')}</Label>
            <Input
              id='unit-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <DialogFooter className='pt-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              {t('units.dialog.cancel')}
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {t('units.dialog.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
