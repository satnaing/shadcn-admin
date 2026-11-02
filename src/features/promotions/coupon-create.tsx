import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CouponFormFields,
  type CouponFormData,
} from './components/coupon-form-fields'
import { usePromotionMutations } from './hooks/usePromotions'

const INITIAL_COUPON: CouponFormData = {
  type: 'cart_base',
  code: '',
  discount: '15',
  discountType: 'percent',
  startDate: '2026-11-05',
  endDate: '2026-12-05',
  minBuy: '50',
  maxDiscount: '30',
  usageLimit: '100',
  status: true,
}

export function CouponCreate() {
  const { t } = useTranslation('promotions')
  const navigate = useNavigate()
  const { saveCouponMutation } = usePromotionMutations()
  const [formData, setFormData] = useState<CouponFormData>(INITIAL_COUPON)

  const handleFieldChange = <K extends keyof CouponFormData>(k: K, v: CouponFormData[K]) => {
    setFormData((prev) => ({ ...prev, [k]: v }))
  }

  const handleGenerateCode = () => {
    const random = 'XSHOP' + Math.floor(1000 + Math.random() * 9000)
    setFormData((prev) => ({ ...prev, code: random }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveCouponMutation.mutate(
      {
        type: formData.type,
        code: formData.code,
        discount: Number(formData.discount) || 0,
        discount_type: formData.discountType,
        start_date: formData.startDate,
        end_date: formData.endDate,
        min_buy: Number(formData.minBuy) || 0,
        max_discount:
          formData.discountType === 'percent'
            ? Number(formData.maxDiscount) || undefined
            : undefined,
        usage_limit: Number(formData.usageLimit) || undefined,
        used_count: 0,
        status: formData.status,
      },
      {
        onSuccess: () => {
          toast.success(t('messages.couponCreated', 'Yeni kupon uğurla yaradıldı!'))
          void navigate({ to: '/admin/promotions/coupons' })
        },
      }
    )
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => void navigate({ to: '/admin/promotions/coupons' })}
          >
            <ArrowLeft className='size-4' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('coupons.addNew', 'Yeni Kupon Yarat')}
            </h1>
            <p className='text-xs text-muted-foreground'>Promokod şərtləri və endirim dərəcəsi</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='max-w-2xl space-y-4'>
          <Card>
            <CardHeader><CardTitle className='text-base'>Kupon Məlumatları</CardTitle></CardHeader>
            <CardContent>
              <CouponFormFields
                data={formData}
                onChange={handleFieldChange}
                onGenerateCode={handleGenerateCode}
              />
            </CardContent>
          </Card>

          <div className='flex justify-end gap-3'>
            <Button
              variant='outline'
              type='button'
              onClick={() => void navigate({ to: '/admin/promotions/coupons' })}
            >
              {t('dialog.cancel', 'Ləğv et')}
            </Button>
            <Button type='submit' className='gap-2' disabled={saveCouponMutation.isPending}>
              <Save className='size-4' />
              {t('dialog.save', 'Yadda saxla')}
            </Button>
          </div>
        </form>
      </Main>
    </>
  )
}

export default CouponCreate
