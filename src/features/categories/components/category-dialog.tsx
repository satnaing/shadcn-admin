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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { CategoryFormData, CategoryItem } from '../data/categories.type'
import { useCategoryOptions } from '../hooks/useCategories'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: CategoryItem | null
  onSubmit: (data: CategoryFormData) => Promise<void>
  isSubmitting?: boolean
}

export function CategoryDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: Props) {
  const { t } = useTranslation('catalog')
  const { data: optionsData } = useCategoryOptions()
  const categoryOptions = optionsData?.data ?? []

  const [name, setName] = useState(initialData?.name ?? '')
  const [parentId, setParentId] = useState<string>(
    initialData?.parent_id ? String(initialData.parent_id) : 'none'
  )
  const [orderLevel, setOrderLevel] = useState(initialData?.order_level ?? 0)
  const [commissionRate, setCommissionRate] = useState(initialData?.commision_rate ?? 0)
  const [featured, setFeatured] = useState(Boolean(initialData?.featured))
  const [hotCategory, setHotCategory] = useState(Boolean(initialData?.hot_category))
  const [digital, setDigital] = useState(Boolean(initialData?.digital))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await onSubmit({
      name,
      parent_id: parentId === 'none' ? null : Number(parentId),
      order_level: Number(orderLevel),
      commision_rate: Number(commissionRate),
      featured,
      hot_category: hotCategory,
      digital,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t('categories.dialog.editTitle')
              : t('categories.dialog.createTitle')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-3.5'>
          <div className='space-y-1'>
            <Label htmlFor='cat-name'>{t('categories.dialog.nameLabel')}</Label>
            <Input id='cat-name' value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className='space-y-1'>
            <Label>{t('categories.dialog.parentLabel')}</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger>
                <SelectValue placeholder={t('categories.noParent')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>{t('categories.noParent')}</SelectItem>
                {categoryOptions
                  .filter((c) => c.id !== initialData?.id)
                  .map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1'>
              <Label htmlFor='cat-order'>{t('categories.dialog.orderLevelLabel')}</Label>
              <Input
                id='cat-order'
                type='number'
                value={orderLevel}
                onChange={(e) => setOrderLevel(Number(e.target.value))}
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='cat-comm'>{t('categories.dialog.commissionLabel')}</Label>
              <Input
                id='cat-comm'
                type='number'
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
              />
            </div>
          </div>

          <div className='space-y-2 pt-1'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='cat-feat' className='cursor-pointer text-xs'>
                {t('categories.dialog.featuredLabel')}
              </Label>
              <Switch id='cat-feat' checked={featured} onCheckedChange={setFeatured} />
            </div>
            <div className='flex items-center justify-between'>
              <Label htmlFor='cat-hot' className='cursor-pointer text-xs'>
                {t('categories.dialog.hotLabel')}
              </Label>
              <Switch id='cat-hot' checked={hotCategory} onCheckedChange={setHotCategory} />
            </div>
            <div className='flex items-center justify-between'>
              <Label htmlFor='cat-dig' className='cursor-pointer text-xs'>
                {t('categories.dialog.digitalLabel')}
              </Label>
              <Switch id='cat-dig' checked={digital} onCheckedChange={setDigital} />
            </div>
          </div>

          <DialogFooter className='pt-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              {t('categories.dialog.cancel')}
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {t('categories.dialog.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
