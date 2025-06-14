export interface IPrice {
  name: string
  price: number | string
  features: string[]
  popular?: boolean
  value: string
  cta?: string
  ctaValue?: string
  credits: number
  intent?: string
}

export interface ITransactionPayload {
  transactionId: string
  status: string
  creditsPurchased: number
  amount: string
  intentData: string
  intent?: string
}

export interface IProduct {
  name: string
  slug: string
  description?: string
  defaultDisplayPrice?: string
  defaultPrice: number
  paymentUrl: string
  imageUrl?: string
  providerId: string
  variant?: IProductVariant[]
  createdAt: Date
  features: string[]
  _id: string
}

export interface IProductVariant {
  name: string
  price: number
  slug: string
  description?: string
  hasFreeTrial?: boolean
  providerId: number
  createdAt: Date
  _id: string
}

export interface IDisplayProductVariant extends IProductVariant {
  displayPrice?: string
}

export interface IDisplayProduct extends Omit<IProduct, 'variant'> {
  variant?: IDisplayProductVariant
}
