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
import type { ColorFormData, ColorItem } from '../data/colors.type'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ColorItem | null
  onSubmit: (data: ColorFormData) => Promise<void>
  isSubmitting?: boolean
}

export function ColorDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const { t } = useTranslation('catalog')

  const [name, setName] = useState(initialData?.name ?? '')
  const [code, setCode] = useState(initialData?.code ?? '#000000')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await onSubmit({
      name,
      code,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t('colors.dialog.editTitle')
              : t('colors.dialog.createTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <Label htmlFor='color-name'>{t('colors.dialog.nameLabel')}</Label>
            <Input
              id='color-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='color-code'>{t('colors.dialog.codeLabel')}</Label>
            <div className='flex items-center gap-2'>
              <input
                type='color'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className='h-9 w-12 cursor-pointer rounded border p-1'
              />
              <Input
                id='color-code'
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder='#000000'
                required
              />
            </div>
          </div>

          <DialogFooter className='pt-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              {t('colors.dialog.cancel')}
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {t('colors.dialog.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
