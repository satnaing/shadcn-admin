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
import { type ClassifiedProductItem } from '../data/customers.type'

interface ClassifiedProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: Partial<ClassifiedProductItem>) => void
}

export function ClassifiedProductDialog({
  open,
  onOpenChange,
  onSave,
}: ClassifiedProductDialogProps) {
  const { t } = useTranslation('customers')
  const [name, setName] = useState('')
  const [customerName, setCustomerName] = useState('Admin Store')
  const [category, setCategory] = useState('Smartfonlar')
  const [condition, setCondition] = useState<'new' | 'used'>('new')
  const [price, setPrice] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      customer_name: customerName,
      category,
      condition,
      unit_price: Number(price) || 0,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=120',
      is_published: isPublished,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <DialogTitle>{t('classified.addNew', 'Yeni Elan Əlavə Et')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-3 py-2'>
          <div className='grid gap-1.5'>
            <Label htmlFor='cp-name'>{t('classified.name', 'Məhsul Adı')}</Label>
            <Input id='cp-name' required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='grid gap-1.5'>
              <Label htmlFor='cp-author'>{t('classified.creator', 'Yaradan / Satıcı')}</Label>
              <Input id='cp-author' required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div className='grid gap-1.5'>
              <Label htmlFor='cp-category'>{t('classified.category', 'Kateqoriya')}</Label>
              <Input id='cp-category' required value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='grid gap-1.5'>
              <Label>{t('classified.condition', 'Vəziyyət')}</Label>
              <Select value={condition} onValueChange={(val) => setCondition(val as 'new' | 'used')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='new'>{t('condition.new', 'Yeni')}</SelectItem>
                  <SelectItem value='used'>{t('condition.used', 'İşlənmiş')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-1.5'>
              <Label htmlFor='cp-price'>{t('classified.price', 'Qiymət (₼)')}</Label>
              <Input id='cp-price' type='number' step='0.01' required value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>

          <div className='grid gap-1.5'>
            <Label htmlFor='cp-thumb'>{t('classified.imageUrl', 'Şəkil URL')}</Label>
            <Input id='cp-thumb' value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder='https://...' />
          </div>

          <div className='flex items-center justify-between rounded-lg border p-2.5'>
            <Label htmlFor='cp-pub' className='cursor-pointer'>{t('classified.published', 'Dərc olunub')}</Label>
            <Switch id='cp-pub' checked={isPublished} onCheckedChange={setIsPublished} />
          </div>

          <DialogFooter className='pt-2'>
            <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>{t('cancel', 'Ləğv et')}</Button>
            <Button type='submit'>{t('save', 'Yadda saxla')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
