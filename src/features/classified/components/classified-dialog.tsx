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
import {
  type ClassifiedCondition,
  type ClassifiedCreatorType,
  type ClassifiedProductItem,
} from '../data/classified.type'

interface ClassifiedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultCreatorType?: ClassifiedCreatorType
  onSave: (payload: Partial<ClassifiedProductItem>) => void
}

export function ClassifiedDialog({
  open,
  onOpenChange,
  defaultCreatorType = 'admin',
  onSave,
}: ClassifiedDialogProps) {
  const { t } = useTranslation('classified')
  const [name, setName] = useState('')
  const [creatorType, setCreatorType] = useState<ClassifiedCreatorType>(defaultCreatorType)
  const [creatorName, setCreatorName] = useState(
    defaultCreatorType === 'admin' ? 'Admin (xShop)' : 'Satıcı Mağazası'
  )
  const [category, setCategory] = useState('Smartfonlar')
  const [condition, setCondition] = useState<ClassifiedCondition>('new')
  const [price, setPrice] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  const handleTypeChange = (type: ClassifiedCreatorType) => {
    setCreatorType(type)
    setCreatorName(type === 'admin' ? 'Admin (xShop)' : 'Satıcı Mağazası')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      creator_type: creatorType,
      creator_name: creatorName,
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
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{t('dialog.title', 'Yeni Elan Əlavə Et')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-3 py-2'>
          <div className='grid gap-1.5'>
            <Label htmlFor='cp-name'>{t('dialog.productName', 'Məhsul Adı')}</Label>
            <Input id='cp-name' required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='grid gap-1.5'>
              <Label>{t('dialog.creatorType', 'Yaradan Növü')}</Label>
              <Select value={creatorType} onValueChange={(val) => handleTypeChange(val as ClassifiedCreatorType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='admin'>{t('types.admin', 'Admin (In-House)')}</SelectItem>
                  <SelectItem value='seller'>{t('types.seller', 'Satıcı')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-1.5'>
              <Label htmlFor='cp-author'>{t('dialog.creatorName', 'Məsul Şəxs / Mağaza')}</Label>
              <Input id='cp-author' required value={creatorName} onChange={(e) => setCreatorName(e.target.value)} />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='grid gap-1.5'>
              <Label htmlFor='cp-cat'>{t('dialog.category', 'Kateqoriya')}</Label>
              <Input id='cp-cat' required value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className='grid gap-1.5'>
              <Label htmlFor='cp-price'>{t('dialog.price', 'Qiymət (₼)')}</Label>
              <Input id='cp-price' type='number' step='0.01' required value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='grid gap-1.5'>
              <Label>{t('dialog.condition', 'Vəziyyət')}</Label>
              <Select value={condition} onValueChange={(val) => setCondition(val as ClassifiedCondition)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='new'>{t('condition.new', 'Yeni')}</SelectItem>
                  <SelectItem value='used'>{t('condition.used', 'İşlənmiş')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-1.5'>
              <Label htmlFor='cp-thumb'>{t('dialog.image', 'Şəkil URL')}</Label>
              <Input id='cp-thumb' value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder='https://...' />
            </div>
          </div>

          <div className='flex items-center justify-between rounded-lg border p-2.5'>
            <Label htmlFor='cp-pub' className='cursor-pointer'>{t('dialog.published', 'Dərhal dərc edilsin')}</Label>
            <Switch id='cp-pub' checked={isPublished} onCheckedChange={setIsPublished} />
          </div>

          <DialogFooter className='pt-2'>
            <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>{t('dialog.cancel', 'Ləğv et')}</Button>
            <Button type='submit'>{t('dialog.save', 'Yadda saxla')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
