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
import { ClassifiedDescCard } from './components/forms/classified-desc-card'
import { ClassifiedGeneralCard } from './components/forms/classified-general-card'
import { ClassifiedMediaCard } from './components/forms/classified-media-card'
import { ClassifiedPricingCard } from './components/forms/classified-pricing-card'
import { ClassifiedPublishCard } from './components/forms/classified-publish-card'
import { ClassifiedShippingSeoCard } from './components/forms/classified-shipping-seo-card'
import { useClassifiedCreateForm } from './hooks/useClassifiedCreateForm'
import { useClassifiedMutations } from './hooks/useClassified'

export function ClassifiedCreate() {
  const { t } = useTranslation('classified')
  const navigate = useNavigate()
  const { createMutation } = useClassifiedMutations()
  const form = useClassifiedCreateForm()

  const { data: catData } = useCategoryOptions()
  const { data: brandsData } = useBrands()
  const { data: unitData } = useUnits()

  const categories = catData?.data ?? []
  const brands = brandsData?.data ?? []
  const units = unitData?.data ?? []

  const { general: g, media: m, pricing: p, desc: d, shippingSeo: s, publish: pub } = form

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const catName = categories.find((c) => c.id === g.categoryId)?.name ?? 'Ümumi'
    const brandName = brands.find((b) => b.id === g.brandId)?.name ?? ''

    createMutation.mutate(
      {
        name: g.name,
        creator_type: p.creatorType,
        creator_name: p.creatorName,
        category: catName,
        category_id: g.categoryId,
        brand_id: g.brandId,
        brand_name: brandName,
        unit: g.unit,
        condition: g.condition,
        unit_price: Number(p.price) || 0,
        purchase_price: Number(p.purchasePrice) || 0,
        discount: Number(p.discount) || 0,
        discount_type: p.discountType,
        tax: Number(p.tax) || 0,
        current_stock: Number(p.stock) || 1,
        sku: p.sku,
        thumbnail: m.thumbnail || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=120',
        photos: m.gallery ? m.gallery.split(',').map((x) => x.trim()) : [],
        video_link: m.videoLink,
        location: g.location,
        phone: g.phone,
        description: d.description,
        tags: d.tags,
        shipping_cost: s.freeShipping ? 0 : s.shippingCost,
        est_shipping_days: s.estDays,
        meta_title: s.metaTitle,
        meta_description: s.metaDesc,
        is_published: pub.isPublished,
        featured: pub.featured,
      },
      {
        onSuccess: () => {
          toast.success(t('messages.created', 'Elan uğurla əlavə edildi!'))
          void navigate({ to: '/admin/classified-products' })
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
            onClick={() => void navigate({ to: '/admin/classified-products' })}
          >
            <ArrowLeft className='size-4' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('actions.addNew', 'Yeni Elan Əlavə Et')}
            </h1>
            <p className='text-xs text-muted-foreground'>
              {t('actions.addNewDesc', 'Admin və ya satıcı adına yeni tam funksiyalı elan məhsulu yarat')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='space-y-4 lg:col-span-2'>
            <ClassifiedGeneralCard
              name={g.name} onNameChange={g.setName}
              categoryId={g.categoryId} onCategoryChange={g.setCategoryId} categories={categories}
              brandId={g.brandId} onBrandChange={g.setBrandId} brands={brands}
              unit={g.unit} onUnitChange={g.setUnit} units={units}
              condition={g.condition} onConditionChange={g.setCondition}
              location={g.location} onLocationChange={g.setLocation}
              phone={g.phone} onPhoneChange={g.setPhone}
              refundable={g.refundable} onRefundableChange={g.setRefundable}
            />

            <ClassifiedMediaCard
              thumbnail={m.thumbnail} onThumbnailChange={m.setThumbnail}
              gallery={m.gallery} onGalleryChange={m.setGallery}
              videoLink={m.videoLink} onVideoLinkChange={m.setVideoLink}
            />

            <ClassifiedPricingCard
              creatorType={p.creatorType} onCreatorTypeChange={p.handleTypeChange}
              creatorName={p.creatorName} onCreatorNameChange={p.setCreatorName}
              price={p.price} onPriceChange={p.setPrice}
              purchasePrice={p.purchasePrice} onPurchasePriceChange={p.setPurchasePrice}
              discount={p.discount} onDiscountChange={p.setDiscount}
              discountType={p.discountType} onDiscountTypeChange={p.setDiscountType}
              tax={p.tax} onTaxChange={p.setTax}
              stock={p.stock} onStockChange={p.setStock}
              sku={p.sku} onSkuChange={p.setSku}
            />

            <ClassifiedDescCard
              description={d.description} onDescriptionChange={d.setDescription}
              tags={d.tags} onTagsChange={d.setTags}
            />

            <ClassifiedShippingSeoCard
              freeShipping={s.freeShipping} onFreeShippingChange={s.setFreeShipping}
              shippingCost={s.shippingCost} onShippingCostChange={s.setShippingCost}
              estDays={s.estDays} onEstDaysChange={s.setEstDays}
              metaTitle={s.metaTitle} onMetaTitleChange={s.setMetaTitle}
              metaDesc={s.metaDesc} onMetaDescChange={s.setMetaDesc}
            />
          </div>

          <div className='space-y-4'>
            <ClassifiedPublishCard
              isPublished={pub.isPublished} onPublishedChange={pub.setIsPublished}
              featured={pub.featured} onFeaturedChange={pub.setFeatured}
              isSubmitting={createMutation.isPending}
              onCancel={() => void navigate({ to: '/admin/classified-products' })}
            />
          </div>
        </form>
      </Main>
    </>
  )
}

export default ClassifiedCreate
