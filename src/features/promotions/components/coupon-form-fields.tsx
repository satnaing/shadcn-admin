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
import { type CouponType } from '../data/promotions.type'

export interface CouponFormData {
  type: CouponType
  code: string
  discount: string
  discountType: 'amount' | 'percent'
  startDate: string
  endDate: string
  minBuy: string
  maxDiscount: string
  usageLimit: string
  status: boolean
}

interface FieldsProps {
  data: CouponFormData
  onChange: <K extends keyof CouponFormData>(k: K, v: CouponFormData[K]) => void
  onGenerateCode: () => void
}

export function CouponFormFields({ data, onChange, onGenerateCode }: FieldsProps) {
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='space-y-1.5'>
          <Label>Kupon Növü</Label>
          <Select value={data.type} onValueChange={(v) => onChange('type', v as CouponType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value='cart_base'>Səbət üzrə (Cart Base)</SelectItem>
              <SelectItem value='product_base'>Məhsul üzrə (Product Base)</SelectItem>
              <SelectItem value='welcome_base'>Xoşgəldin (Welcome Base)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='cpn-code'>Kupon Kodu *</Label>
            <button type='button' onClick={onGenerateCode} className='text-xs text-primary hover:underline'>
              Kod yarat
            </button>
          </div>
          <Input id='cpn-code' required value={data.code} onChange={(e) => onChange('code', e.target.value.toUpperCase())} placeholder='Məs: XSHOP20' />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='space-y-1.5'>
          <Label htmlFor='cpn-discount'>Endirim Məbləği/Faizi *</Label>
          <Input id='cpn-discount' type='number' min='0' step='0.1' required value={data.discount} onChange={(e) => onChange('discount', e.target.value)} />
        </div>
        <div className='space-y-1.5'>
          <Label>Endirim Tipi</Label>
          <Select value={data.discountType} onValueChange={(v) => onChange('discountType', v as 'amount' | 'percent')}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value='percent'>Faiz (%)</SelectItem>
              <SelectItem value='amount'>Sabit Məbləğ (₼)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='space-y-1.5'>
          <Label htmlFor='cpn-start'>Başlama Tarixi *</Label>
          <Input id='cpn-start' type='date' required value={data.startDate} onChange={(e) => onChange('startDate', e.target.value)} />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='cpn-end'>Bitmə Tarixi *</Label>
          <Input id='cpn-end' type='date' required value={data.endDate} onChange={(e) => onChange('endDate', e.target.value)} />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
        <div className='space-y-1.5'>
          <Label htmlFor='cpn-min'>Min. Alış Məbləği (₼)</Label>
          <Input id='cpn-min' type='number' min='0' value={data.minBuy} onChange={(e) => onChange('minBuy', e.target.value)} />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='cpn-max'>Maks. Endirim (₼)</Label>
          <Input id='cpn-max' type='number' min='0' value={data.maxDiscount} onChange={(e) => onChange('maxDiscount', e.target.value)} />
        </div>
        <div className='space-y-1.5'>
          <Label htmlFor='cpn-limit'>İstifadə Limiti</Label>
          <Input id='cpn-limit' type='number' min='1' value={data.usageLimit} onChange={(e) => onChange('usageLimit', e.target.value)} />
        </div>
      </div>

      <div className='flex items-center justify-between rounded-lg border p-3'>
        <div>
          <div className='text-sm font-medium'>Aktiv Status</div>
          <div className='text-xs text-muted-foreground'>Kupon alış-veriş zamanı dərhal tətbiq olunsun</div>
        </div>
        <Switch checked={data.status} onCheckedChange={(v) => onChange('status', v)} />
      </div>
    </div>
  )
}
