import { Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface ShippingSeoProps {
  freeShipping: boolean
  onFreeShippingChange: (v: boolean) => void
  shippingCost: number
  onShippingCostChange: (v: number) => void
  estDays: number
  onEstDaysChange: (v: number) => void
  metaTitle: string
  onMetaTitleChange: (v: string) => void
  metaDesc: string
  onMetaDescChange: (v: string) => void
}

export function ClassifiedShippingSeoCard({
  freeShipping,
  onFreeShippingChange,
  shippingCost,
  onShippingCostChange,
  estDays,
  onEstDaysChange,
  metaTitle,
  onMetaTitleChange,
  metaDesc,
  onMetaDescChange,
}: ShippingSeoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base flex items-center gap-2'>
          <Truck className='size-4 text-primary' />
          Çatdırılma və SEO Parametrləri
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between rounded-lg border p-3'>
          <div>
            <div className='text-sm font-medium'>Pulsuz Çatdırılma (Free Shipping)</div>
            <div className='text-xs text-muted-foreground'>Bu elan məhsulu üçün çatdırılma pulsuzdur</div>
          </div>
          <Switch checked={freeShipping} onCheckedChange={onFreeShippingChange} />
        </div>

        {!freeShipping && (
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='cp-ship-cost'>Çatdırılma Haqqı (₼)</Label>
              <Input
                id='cp-ship-cost'
                type='number'
                min='0'
                step='0.5'
                value={shippingCost}
                onChange={(e) => onShippingCostChange(Number(e.target.value) || 0)}
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='cp-ship-days'>Təxmini Çatdırılma Müddəti (Gün)</Label>
              <Input
                id='cp-ship-days'
                type='number'
                min='1'
                value={estDays}
                onChange={(e) => onEstDaysChange(Number(e.target.value) || 1)}
              />
            </div>
          </div>
        )}

        <div className='border-t pt-3 space-y-3'>
          <div className='text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
            SEO Meta Məlumatları
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='cp-meta-title'>Meta Başlıq (Title)</Label>
            <Input
              id='cp-meta-title'
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              placeholder='Elan adı | xShop'
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='cp-meta-desc'>Meta Təsvir (Description)</Label>
            <Textarea
              id='cp-meta-desc'
              rows={2}
              value={metaDesc}
              onChange={(e) => onMetaDescChange(e.target.value)}
              placeholder='Google axtarışında görünəcək qısa mətn...'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
