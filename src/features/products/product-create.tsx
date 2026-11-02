import { ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { useBrands } from '@/features/brands/hooks/useBrands'
import { useCategoryOptions } from '@/features/categories/hooks/useCategories'
import { useUnits } from '@/features/units/hooks/useUnits'
import { ProductDescriptionCard } from './components/forms/product-description-card'
import { ProductGeneralCard } from './components/forms/product-general-card'
import { ProductMediaCard } from './components/forms/product-media-card'
import { ProductPricingCard } from './components/forms/product-pricing-card'
import { ProductPublishCard } from './components/forms/product-publish-card'
import { ProductShippingSeoCard } from './components/forms/product-shipping-seo-card'
import { useProductCreateForm } from './hooks/useProductCreateForm'
import { useProductMutations } from './hooks/useProducts'

export function ProductCreate() {
  const { t } = useTranslation('products')
  const navigate = useNavigate()
  const { createProduct, isCreating } = useProductMutations()
  const form = useProductCreateForm()

  const { data: catData } = useCategoryOptions()
  const { data: brandsData } = useBrands()
  const { data: unitData } = useUnits()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { general: g, media: m, pricing: p, desc: d, shippingSeo: s, publish: pub } = form
    await createProduct({
      name: g.name,
      category_id: g.categoryId,
      brand_id: g.brandId,
      unit: g.unit,
      min_qty: g.minQty,
      barcode: g.barcode,
      refundable: g.refundable,
      thumbnail_img: m.thumbnail,
      photos: m.galleryImages ? m.galleryImages.split(',').map((x) => x.trim()) : [],
      video_link: m.videoLink,
      unit_price: Number(p.unitPrice),
      purchase_price: Number(p.purchasePrice),
      discount: Number(p.discount),
      discount_type: p.discountType,
      tax: Number(p.tax),
      current_stock: Number(p.currentStock),
      sku: p.sku,
      description: d.description,
      tags: d.tags,
      shipping_cost: s.freeShipping ? 0 : s.shippingCost,
      est_shipping_days: s.estDays,
      meta_title: s.metaTitle,
      meta_description: s.metaDesc,
      published: pub.published,
      featured: pub.featured,
      todays_deal: pub.todaysDeal,
    })
    toast.success('Məhsul uğurla əlavə edildi!')
    void navigate({ to: '/admin/products' })
  }

  const { general: g, media: m, pricing: p, desc: d, shippingSeo: s, publish: pub } = form

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='icon' onClick={() => void navigate({ to: '/admin/products' })}>
            <ArrowLeft className='size-4' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>{t('create.title', 'Yeni Məhsul Əlavə Et')}</h1>
            <p className='text-xs text-muted-foreground'>
              {t('create.subtitle', 'Məhsulun əsas məlumatları, media faylları, qiyməti, stoku və çatdırılması')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='space-y-4 lg:col-span-2'>
            <ProductGeneralCard
              name={g.name} onNameChange={g.setName}
              categoryId={g.categoryId} onCategoryChange={g.setCategoryId} categories={catData?.data ?? []}
              brandId={g.brandId} onBrandChange={g.setBrandId} brands={brandsData?.data ?? []}
              unit={g.unit} onUnitChange={g.setUnit} units={unitData?.data ?? []}
              minQty={g.minQty} onMinQtyChange={g.setMinQty}
              barcode={g.barcode} onBarcodeChange={g.setBarcode}
              refundable={g.refundable} onRefundableChange={g.setRefundable}
            />

            <ProductMediaCard
              thumbnail={m.thumbnail} onThumbnailChange={m.setThumbnail}
              galleryImages={m.galleryImages} onGalleryChange={m.setGalleryImages}
              videoLink={m.videoLink} onVideoLinkChange={m.setVideoLink}
            />

            <ProductPricingCard
              unitPrice={p.unitPrice} onUnitPriceChange={p.setUnitPrice}
              purchasePrice={p.purchasePrice} onPurchasePriceChange={p.setPurchasePrice}
              discount={p.discount} onDiscountChange={p.setDiscount}
              discountType={p.discountType} onDiscountTypeChange={p.setDiscountType}
              tax={p.tax} onTaxChange={p.setTax}
              stock={p.currentStock} onStockChange={p.setCurrentStock}
              sku={p.sku} onSkuChange={p.setSku}
            />

            <ProductDescriptionCard
              description={d.description} onDescriptionChange={d.setDescription}
              tags={d.tags} onTagsChange={d.setTags}
            />

            <ProductShippingSeoCard
              freeShipping={s.freeShipping} onFreeShippingChange={s.setFreeShipping}
              shippingCost={s.shippingCost} onShippingCostChange={s.setShippingCost}
              estDays={s.estDays} onEstDaysChange={s.setEstDays}
              metaTitle={s.metaTitle} onMetaTitleChange={s.setMetaTitle}
              metaDesc={s.metaDesc} onMetaDescChange={s.setMetaDesc}
            />
          </div>

          <div className='space-y-4'>
            <ProductPublishCard
              published={pub.published} onPublishedChange={pub.setPublished}
              featured={pub.featured} onFeaturedChange={pub.setFeatured}
              todaysDeal={pub.todaysDeal} onTodaysDealChange={pub.setTodaysDeal}
              isSubmitting={isCreating} onCancel={() => void navigate({ to: '/admin/products' })}
            />
          </div>
        </form>
      </Main>
    </>
  )
}

export default ProductCreate
