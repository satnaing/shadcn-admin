import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
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
import { useCategoryOptions } from '@/features/categories/hooks/useCategories'
import type { UnitItem } from '@/features/units/data/units.type'
import { useUnits } from '@/features/units/hooks/useUnits'
import { ProductWholesaleCard } from '../components/forms/product-wholesale-card'
import type { WholesaleTier } from '../data/products.type'
import { useProductMutations } from '../hooks/useProducts'

export function WholesaleCreate() {
  const { t } = useTranslation('products')
  const navigate = useNavigate()
  const { createProduct, isCreating } = useProductMutations()
  const { data: catData } = useCategoryOptions()
  const categories: CategoryItem[] = catData?.data ?? []
  const { data: unitData } = useUnits()
  const units: UnitItem[] = unitData?.data ?? []

  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id ?? 1)
  const [unit, setUnit] = useState('ədəd (pc)')
  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [currentStock, setCurrentStock] = useState<number>(50)
  const [published, setPublished] = useState(true)
  const [wholesaleTiers, setWholesaleTiers] = useState<WholesaleTier[]>([
    { min_qty: 5, price: 0 },
    { min_qty: 10, price: 0 },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createProduct({
      name,
      category_id: categoryId,
      brand_id: null,
      unit,
      unit_price: Number(unitPrice),
      current_stock: Number(currentStock),
      published,
      wholesale_prices: wholesaleTiers,
    })
    navigate({ to: '/admin/wholesale-products' })
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='icon' asChild>
            <Link to='/admin/wholesale-products'><ArrowLeft className='size-4' /></Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>{t('wholesale.createTitle', 'Yeni Topdan Satış Məhsulu')}</h1>
            <p className='text-xs text-muted-foreground'>{t('wholesale.createSubtitle', 'Minimum sifariş miqdarı və pilləli qiymət konfiqurasiyası')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='space-y-4 lg:col-span-2'>
            <Card>
              <CardHeader><CardTitle className='text-base'>{t('form.generalInfo', 'Əsas Məlumatlar')}</CardTitle></CardHeader>
              <CardContent className='space-y-3'>
                <div className='space-y-1'>
                  <Label>{t('form.name', 'Məhsulun Adı')}</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder='məs. Topdan A4 Kağız Paketi (500 vərəq)' />
                </div>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  <div className='space-y-1'>
                    <Label>{t('form.category', 'Kateqoriya')}</Label>
                    <Select value={String(categoryId)} onValueChange={(val) => setCategoryId(Number(val))}>
                      <SelectTrigger><SelectValue placeholder='Kateqoriya seç' /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-1'>
                    <Label>{t('form.unit', 'Ölçü Vahidi')}</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger><SelectValue placeholder={t('form.selectUnit', 'Ölçü vahidi seç')} /></SelectTrigger>
                      <SelectContent>
                        {units.length > 0 ? (
                          units.map((u) => (<SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>))
                        ) : (
                          <SelectItem value='ədəd (pc)'>ədəd (pc)</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ProductWholesaleCard unit={unit} unitPrice={unitPrice} tiers={wholesaleTiers} onTiersChange={setWholesaleTiers} />
          </div>

          <div className='space-y-4'>
            <Card>
              <CardHeader><CardTitle className='text-base'>{t('form.pricingStock', 'Pərakəndə Qiymət və Stok')}</CardTitle></CardHeader>
              <CardContent className='space-y-3'>
                <div className='space-y-1'>
                  <Label>{t('form.unitPrice', 'Əsas Qiymət (₼)')}</Label>
                  <Input type='number' min='0' step='0.01' value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} required />
                </div>
                <div className='space-y-1'>
                  <Label>{t('form.stock', 'Stok Miqdarı')}</Label>
                  <Input type='number' min='0' value={currentStock} onChange={(e) => setCurrentStock(Number(e.target.value))} required />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className='text-base'>{t('form.statusSettings', 'Nəşr Parametrləri')}</CardTitle></CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <Label>{t('table.published', 'Dərc edilsin')}</Label>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
                <Button type='submit' className='w-full mt-4' disabled={isCreating}>
                  {isCreating ? t('common.saving', 'Yadda saxlanılır...') : t('wholesale.save', 'Topdan Məhsulu Yarat')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Main>
    </>
  )
}

export default WholesaleCreate
