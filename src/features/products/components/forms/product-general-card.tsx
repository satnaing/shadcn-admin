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
  minQty: number
  onMinQtyChange: (v: number) => void
  barcode: string
  onBarcodeChange: (v: string) => void
  refundable: boolean
  onRefundableChange: (v: boolean) => void
}

export function ProductGeneralCard({
  name, onNameChange, categoryId, onCategoryChange, categories,
  brandId, onBrandChange, brands, unit, onUnitChange, units,
  minQty, onMinQtyChange, barcode, onBarcodeChange, refundable, onRefundableChange,
}: GeneralCardProps) {
  const { t } = useTranslation('products')

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{t('form.generalInfo', 'Əsas Məlumatlar')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='p-name'>{t('form.name', 'Məhsulun Adı')} *</Label>
          <Input
            id='p-name'
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
            placeholder='məs. iPhone 15 Pro Max 256GB'
          />
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label>{t('form.category', 'Kateqoriya')} *</Label>
            <Select value={String(categoryId)} onValueChange={(val) => onCategoryChange(Number(val))}>
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

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          <div className='space-y-1.5'>
            <Label>{t('form.unit', 'Ölçü Vahidi')} *</Label>
            <Select value={unit} onValueChange={onUnitChange}>
              <SelectTrigger><SelectValue placeholder={t('form.selectUnit', 'Ölçü vahidi')} /></SelectTrigger>
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
            <Label htmlFor='p-min-qty'>Min. Sifariş Sayı</Label>
            <Input
              id='p-min-qty'
              type='number'
              min='1'
              value={minQty}
              onChange={(e) => onMinQtyChange(Number(e.target.value) || 1)}
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='p-barcode'>Barkod / Barcode</Label>
            <Input id='p-barcode' value={barcode} onChange={(e) => onBarcodeChange(e.target.value)} placeholder='EAN/UPC' />
          </div>
        </div>

        <div className='flex items-center justify-between rounded-lg border p-3'>
          <div>
            <div className='text-sm font-medium'>Geri Qaytarıla Bilən (Refundable)</div>
            <div className='text-xs text-muted-foreground'>Müştəri bu məhsulu 14 gün ərzində qaytara bilər</div>
          </div>
          <Switch checked={refundable} onCheckedChange={onRefundableChange} />
        </div>
      </CardContent>
    </Card>
  )
}
