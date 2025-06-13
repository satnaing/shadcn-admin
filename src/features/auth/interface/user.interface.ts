import {
  IProduct,
  IProductVariant,
} from '@/features/pricing/interface/price.interface'
import { ISubscription } from '@/features/subscription/interface/subscription.interface'

export enum UserSubscriptionStatus {
  IN_TRIAL = 'in-trial',
  TRIAL_EXPIRED = 'trial-expired',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface IUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  provider: string
  providerId: string
  image: IMedia
  intent: string
  subscribedProduct?: IProduct
  subscribedProductId: string
  subscribedProductVariantId: string
  subscribedProductVariant?: IProductVariant
  status: UserSubscriptionStatus
  subscription?: ISubscription | null
}

export interface IMedia {
  _id: string
  url: string
}
