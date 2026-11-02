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
import { type ClassifiedCreatorType } from '../../data/classified.type'

interface PricingCardProps {
  creatorType: ClassifiedCreatorType
  onCreatorTypeChange: (v: ClassifiedCreatorType) => void
  creatorName: string
  onCreatorNameChange: (v: string) => void
  price: string
  onPriceChange: (v: string) => void
  purchasePrice: string
  onPurchasePriceChange: (v: string) => void
  discount: string
  onDiscountChange: (v: string) => void
  discountType: 'flat' | 'percent'
  onDiscountTypeChange: (v: 'flat' | 'percent') => void
  tax: string
  onTaxChange: (v: string) => void
  stock: string
  onStockChange: (v: string) => void
  sku: string
  onSkuChange: (v: string) => void
}

export function ClassifiedPricingCard({
  creatorType, onCreatorTypeChange, creatorName, onCreatorNameChange,
  price, onPriceChange, purchasePrice, onPurchasePriceChange,
  discount, onDiscountChange, discountType, onDiscountTypeChange,
  tax, onTaxChange, stock, onStockChange, sku, onSkuChange,
}: PricingCardProps) {
  const { t } = useTranslation('classified')

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Yaradan, Qiymət və Stok</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <Label>{t('dialog.creatorType', 'Yaradan Növü')} *</Label>
            <Select value={creatorType} onValueChange={(val) => onCreatorTypeChange(val as ClassifiedCreatorType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value='admin'>{t('types.admin', 'Admin (In-House)')}</SelectItem>
                <SelectItem value='seller'>{t('types.seller', 'Satıcı')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='cp-author'>{t('dialog.creatorName', 'Məsul Şəxs / Mağaza')} *</Label>
            <Input
              id='cp-author'
              required
              value={creatorName}
              onChange={(e) => onCreatorNameChange(e.target.value)}
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 border-t pt-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='cp-price'>{t('dialog.price', 'Satış Qiyməti (₼)')} *</Label>
            <Input
              id='cp-price'
              type='number'
              step='0.01'
              required
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder='0.00'
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='cp-pprice'>Alış / Maya Qiyməti (₼)</Label>
            <Input
              id='cp-pprice'
              type='number'
              step='0.01'
              value={purchasePrice}
              onChange={(e) => onPurchasePriceChange(e.target.value)}
              placeholder='0.00'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='cp-disc'>Endirim</Label>
            <Input
              id='cp-disc'
              type='number'
              value={discount}
              onChange={(e) => onDiscountChange(e.target.value)}
              placeholder='0'
            />
          </div>

          <div className='space-y-1.5'>
            <Label>Endirim Növü</Label>
            <Select value={discountType} onValueChange={(v) => onDiscountTypeChange(v as 'flat' | 'percent')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value='flat'>Məbləğ (₼)</SelectItem>
                <SelectItem value='percent'>Faiz (%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='cp-tax'>Vergi (%)</Label>
            <Input
              id='cp-tax'
              type='number'
              value={tax}
              onChange={(e) => onTaxChange(e.target.value)}
              placeholder='0'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 border-t pt-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='cp-stock'>Stok Miqdarı *</Label>
            <Input
              id='cp-stock'
              type='number'
              min='0'
              value={stock}
              onChange={(e) => onStockChange(e.target.value)}
              placeholder='1'
            />
          </div>

          <div className='space-y-1.5'>
            <Label htmlFor='cp-sku'>SKU / Məhsul Kodu</Label>
            <Input
              id='cp-sku'
              value={sku}
              onChange={(e) => onSkuChange(e.target.value)}
              placeholder='CLS-1001'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
