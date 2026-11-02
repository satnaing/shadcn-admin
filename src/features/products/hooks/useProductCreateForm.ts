import { useState } from 'react'

export function useProductCreateForm() {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<number>(1)
  const [brandId, setBrandId] = useState<number | null>(null)
  const [unit, setUnit] = useState('ədəd (pc)')
  const [minQty, setMinQty] = useState(1)
  const [barcode, setBarcode] = useState('')
  const [refundable, setRefundable] = useState(true)

  const [thumbnail, setThumbnail] = useState('')
  const [galleryImages, setGalleryImages] = useState('')
  const [videoLink, setVideoLink] = useState('')

  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [purchasePrice, setPurchasePrice] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount')
  const [tax, setTax] = useState<number>(18)
  const [currentStock, setCurrentStock] = useState<number>(10)
  const [sku, setSku] = useState('')

  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const [freeShipping, setFreeShipping] = useState(false)
  const [shippingCost, setShippingCost] = useState<number>(5)
  const [estDays, setEstDays] = useState<number>(2)
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDesc, setMetaDesc] = useState('')

  const [published, setPublished] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [todaysDeal, setTodaysDeal] = useState(false)

  return {
    general: { name, setName, categoryId, setCategoryId, brandId, setBrandId, unit, setUnit, minQty, setMinQty, barcode, setBarcode, refundable, setRefundable },
    media: { thumbnail, setThumbnail, galleryImages, setGalleryImages, videoLink, setVideoLink },
    pricing: { unitPrice, setUnitPrice, purchasePrice, setPurchasePrice, discount, setDiscount, discountType, setDiscountType, tax, setTax, currentStock, setCurrentStock, sku, setSku },
    desc: { description, setDescription, tags, setTags },
    shippingSeo: { freeShipping, setFreeShipping, shippingCost, setShippingCost, estDays, setEstDays, metaTitle, setMetaTitle, metaDesc, setMetaDesc },
    publish: { published, setPublished, featured, setFeatured, todaysDeal, setTodaysDeal },
  }
}
