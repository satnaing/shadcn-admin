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

interface PricingCardProps {
  unitPrice: number
  onUnitPriceChange: (v: number) => void
  purchasePrice: number
  onPurchasePriceChange: (v: number) => void
  discount: number
  onDiscountChange: (v: number) => void
  discountType: 'amount' | 'percent'
  onDiscountTypeChange: (v: 'amount' | 'percent') => void
  tax: number
  onTaxChange: (v: number) => void
  stock: number
  onStockChange: (v: number) => void
  sku: string
  onSkuChange: (v: string) => void
}

export function ProductPricingCard({
  unitPrice,
  onUnitPriceChange,
  purchasePrice,
  onPurchasePriceChange,
  discount,
  onDiscountChange,
  discountType,
  onDiscountTypeChange,
  tax,
  onTaxChange,
  stock,
  onStockChange,
  sku,
  onSkuChange,
}: PricingCardProps) {
  const { t } = useTranslation('products')

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{t('form.pricingStock', 'Qiymət, Endirim və Stok')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='p-price'>{t('form.unitPrice', 'Satış Qiyməti (₼)')} *</Label>
            <Input
              id='p-price'
              type='number'
              min='0'
              step='0.01'
              value={unitPrice}
              onChange={(e) => onUnitPriceChange(Number(e.target.value) || 0)}
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='p-cost'>Maya Dəyəri / Purchase Price (₼)</Label>
            <Input
              id='p-cost'
              type='number'
              min='0'
              step='0.01'
              value={purchasePrice}
              onChange={(e) => onPurchasePriceChange(Number(e.target.value) || 0)}
              placeholder='0.00'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='p-disc'>Endirim</Label>
            <Input
              id='p-disc'
              type='number'
              min='0'
              step='0.01'
              value={discount}
              onChange={(e) => onDiscountChange(Number(e.target.value) || 0)}
            />
          </div>

          <div className='space-y-1.5'>
            <Label>Endirim Növü</Label>
            <Select value={discountType} onValueChange={(v) => onDiscountTypeChange(v as 'amount' | 'percent')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value='amount'>Sabit Məbləğ (₼)</SelectItem>
                <SelectItem value='percent'>Faiz (%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='p-tax'>ƏDV / Vergi (%)</Label>
            <Input
              id='p-tax'
              type='number'
              min='0'
              max='100'
              value={tax}
              onChange={(e) => onTaxChange(Number(e.target.value) || 0)}
              placeholder='18'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 border-t pt-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='p-stock'>{t('form.stock', 'Cari Stok Miqdarı')} *</Label>
            <Input
              id='p-stock'
              type='number'
              min='0'
              value={stock}
              onChange={(e) => onStockChange(Number(e.target.value) || 0)}
              required
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='p-sku'>SKU (Artikul kodu)</Label>
            <Input
              id='p-sku'
              value={sku}
              onChange={(e) => onSkuChange(e.target.value)}
              placeholder='Məs: IPH-15-256-BLK'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
