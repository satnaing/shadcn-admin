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
import { useCategoryOptions } from '@/features/categories/hooks/useCategories'
import { type CategoryDiscountItem } from '../data/promotions.type'

interface CategoryDiscountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: Partial<CategoryDiscountItem>) => void
}

export function CategoryDiscountDialog({
  open,
  onOpenChange,
  onSave,
}: CategoryDiscountDialogProps) {
  const { t } = useTranslation('promotions')
  const { data: catData } = useCategoryOptions()
  const categories = catData?.data ?? []

  const [categoryId, setCategoryId] = useState<string>('')
  const [discount, setDiscount] = useState<string>('10')
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('percent')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedCat = categories.find((c) => String(c.id) === categoryId)
    if (selectedCat) {
      onSave({
        category_id: selectedCat.id,
        category_name: selectedCat.name,
        discount: Number(discount) || 0,
        discount_type: discountType,
        status: true,
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[420px]'>
        <DialogHeader>
          <DialogTitle>{t('categories.addTitle', 'Kateqoriyaya Toplu Endirim Təyin Et')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-3 py-2'>
          <div className='grid gap-1.5'>
            <Label>{t('categories.selectCategory', 'Kateqoriya Seç')}</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger><SelectValue placeholder='Kateqoriya seçin...' /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='grid gap-1.5'>
              <Label htmlFor='cd-discount'>{t('categories.discountValue', 'Endirim Dəyəri')}</Label>
              <Input
                id='cd-discount'
                type='number'
                min='1'
                required
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className='grid gap-1.5'>
              <Label>{t('categories.discountType', 'Endirim Növü')}</Label>
              <Select value={discountType} onValueChange={(val) => setDiscountType(val as 'amount' | 'percent')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='percent'>Faiz (%)</SelectItem>
                  <SelectItem value='amount'>Sabit Məbləğ (₼)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className='pt-2'>
            <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>
              {t('dialog.cancel', 'Ləğv et')}
            </Button>
            <Button type='submit' disabled={!categoryId}>
              {t('dialog.save', 'Tətbiq Et')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
