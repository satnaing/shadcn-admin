import { useState } from 'react'
import { type ClassifiedCondition, type ClassifiedCreatorType } from '../data/classified.type'

export function useClassifiedCreateForm() {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(0)
  const [brandId, setBrandId] = useState<number | null>(null)
  const [unit, setUnit] = useState('ədəd (pc)')
  const [condition, setCondition] = useState<ClassifiedCondition>('new')
  const [location, setLocation] = useState('Bakı')
  const [phone, setPhone] = useState('')
  const [refundable, setRefundable] = useState(false)

  const [thumbnail, setThumbnail] = useState('')
  const [gallery, setGallery] = useState('')
  const [videoLink, setVideoLink] = useState('')

  const [creatorType, setCreatorType] = useState<ClassifiedCreatorType>('admin')
  const [creatorName, setCreatorName] = useState('Admin (xShop)')
  const [price, setPrice] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [discount, setDiscount] = useState('0')
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat')
  const [tax, setTax] = useState('0')
  const [stock, setStock] = useState('1')
  const [sku, setSku] = useState('')

  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const [freeShipping, setFreeShipping] = useState(true)
  const [shippingCost, setShippingCost] = useState(0)
  const [estDays, setEstDays] = useState(2)
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDesc, setMetaDesc] = useState('')

  const [isPublished, setIsPublished] = useState(true)
  const [featured, setFeatured] = useState(false)

  const handleTypeChange = (type: ClassifiedCreatorType) => {
    setCreatorType(type)
    setCreatorName(type === 'admin' ? 'Admin (xShop)' : 'Satıcı Mağazası')
  }

  return {
    general: {
      name, setName, categoryId, setCategoryId, brandId, setBrandId,
      unit, setUnit, condition, setCondition, location, setLocation,
      phone, setPhone, refundable, setRefundable,
    },
    media: { thumbnail, setThumbnail, gallery, setGallery, videoLink, setVideoLink },
    pricing: {
      creatorType, handleTypeChange, creatorName, setCreatorName,
      price, setPrice, purchasePrice, setPurchasePrice,
      discount, setDiscount, discountType, setDiscountType,
      tax, setTax, stock, setStock, sku, setSku,
    },
    desc: { description, setDescription, tags, setTags },
    shippingSeo: {
      freeShipping, setFreeShipping, shippingCost, setShippingCost,
      estDays, setEstDays, metaTitle, setMetaTitle, metaDesc, setMetaDesc,
    },
    publish: { isPublished, setIsPublished, featured, setFeatured },
  }
}
