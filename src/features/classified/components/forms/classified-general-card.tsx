import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import type { CategoryItem } from '@/features/categories/data/categories.type'
import type { UnitItem } from '@/features/units/data/units.type'
import { type ClassifiedCondition } from '../../data/classified.type'

interface GeneralCardProps {
  name: string
  onNameChange: (v: string) => void
  categoryId: number
  onCategoryChange: (v: number) => void
  categories: CategoryItem[]
  brandId: number | null
  onBrandChange: (v: number | null) => void
  brands: Array<{ id: number; name: string }>
  unit: string
  onUnitChange: (v: string) => void
  units: UnitItem[]
  condition: ClassifiedCondition
  onConditionChange: (v: ClassifiedCondition) => void
  location: string
  onLocationChange: (v: string) => void
  phone: string
  onPhoneChange: (v: string) => void
  refundable: boolean
  onRefundableChange: (v: boolean) => void
}

export function ClassifiedGeneralCard({
  name, onNameChange, categoryId, onCategoryChange, categories,
  brandId, onBrandChange, brands, unit, onUnitChange, units,
  condition, onConditionChange, location, onLocationChange,
  phone, onPhoneChange, refundable, onRefundableChange,
}: GeneralCardProps) {
  const { t } = useTranslation('classified')

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{t('dialog.generalInfo', 'Əsas Məlumatlar')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='cp-name'>{t('dialog.productName', 'Məhsul / Elan Adı')} *</Label>
          <Input
            id='cp-name'
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder='məs. iPhone 15 Pro Max 256GB'
          />
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label>{t('dialog.category', 'Kateqoriya')} *</Label>
            <Select value={categoryId ? String(categoryId) : ''} onValueChange={(val) => onCategoryChange(Number(val))}>
              <SelectTrigger><SelectValue placeholder='Kateqoriya seç' /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5'>
            <Label>Brend</Label>
            <Select
              value={brandId ? String(brandId) : 'none'}
              onValueChange={(val) => onBrandChange(val === 'none' ? null : Number(val))}
            >
              <SelectTrigger><SelectValue placeholder='Brend seç (istəyə bağlı)' /></SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>Brendsiz</SelectItem>
                {brands.map((b) => (<SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label>{t('form.unit', 'Ölçü Vahidi')}</Label>
            <Select value={unit} onValueChange={onUnitChange}>
              <SelectTrigger><SelectValue placeholder='Ölçü vahidi seç' /></SelectTrigger>
              <SelectContent>
                {units.length > 0 ? (
                  units.map((u) => (<SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>))
                ) : (
                  <SelectItem value='ədəd (pc)'>ədəd (pc)</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5'>
            <Label>{t('dialog.condition', 'Vəziyyət')} *</Label>
            <Select value={condition} onValueChange={(val) => onConditionChange(val as ClassifiedCondition)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value='new'>{t('condition.new', 'Yeni')}</SelectItem>
                <SelectItem value='used'>{t('condition.used', 'İşlənmiş')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='cp-loc'>{t('dialog.location', 'Şəhər / Ünvan')}</Label>
            <Input
              id='cp-loc'
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder='məs. Bakı, Nəsimi r.'
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='cp-phone'>Əlaqə Nömrəsi</Label>
            <Input
              id='cp-phone'
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder='+994 50 123 45 67'
            />
          </div>
        </div>

        <div className='flex items-center justify-between rounded-lg border p-3'>
          <div>
            <div className='text-sm font-medium'>Geri Qaytarıla Bilən (Refundable)</div>
            <div className='text-xs text-muted-foreground'>Müştəri bu elan məhsulunu qaytara bilər</div>
          </div>
          <Switch checked={refundable} onCheckedChange={onRefundableChange} />
        </div>
      </CardContent>
    </Card>
  )
}
