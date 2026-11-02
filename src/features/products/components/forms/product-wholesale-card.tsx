import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { WholesaleTier } from '../../data/products.type'

interface ProductWholesaleCardProps {
  unit: string
  unitPrice: number
  tiers: WholesaleTier[]
  onTiersChange: (tiers: WholesaleTier[]) => void
}

export function ProductWholesaleCard({
  unit,
  unitPrice,
  tiers,
  onTiersChange,
}: ProductWholesaleCardProps) {
  const { t } = useTranslation('products')

  const addTier = () => {
    onTiersChange([...tiers, { min_qty: 5, price: unitPrice > 0 ? unitPrice * 0.9 : 0 }])
  }

  const removeTier = (index: number) => {
    onTiersChange(tiers.filter((_, i) => i !== index))
  }

  const updateTier = (index: number, field: 'min_qty' | 'price', value: number) => {
    onTiersChange(
      tiers.map((tier, i) => (i === index ? { ...tier, [field]: value } : tier))
    )
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-base'>
          {t('form.wholesale', 'Topdan Satış Qiymətləri (Wholesale)')}
        </CardTitle>
        <Button type='button' variant='outline' size='sm' onClick={addTier} className='gap-1'>
          <Plus className='size-3' />
          {t('form.addTier', 'Pillə Əlavə Et')}
        </Button>
      </CardHeader>
      <CardContent className='space-y-2'>
        {tiers.length === 0 ? (
          <p className='text-xs text-muted-foreground'>
            {t('form.noWholesale', 'Topdan satış qiyməti təyin edilməyib.')}
          </p>
        ) : (
          tiers.map((tier, idx) => (
            <div key={idx} className='flex items-center gap-2'>
              <Input
                type='number'
                min='2'
                value={tier.min_qty}
                onChange={(e) => updateTier(idx, 'min_qty', Number(e.target.value))}
                placeholder='Min Say'
                className='w-28'
              />
              <span className='text-xs text-muted-foreground'>{unit} üçün</span>
              <Input
                type='number'
                min='0'
                step='0.01'
                value={tier.price}
                onChange={(e) => updateTier(idx, 'price', Number(e.target.value))}
                placeholder='Xüsusi Qiymət (₼)'
                className='w-36'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => removeTier(idx)}
                className='text-destructive'
              >
                <Trash2 className='size-4' />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
