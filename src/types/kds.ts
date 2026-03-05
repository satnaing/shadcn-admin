import { type OrderStatus } from './api'

export interface KdsOrderOption {
  choiceId: string
  optionName: string
  quantity: number
  unitPrice: number
  subtotal: number
  badgeId?: string | null
}

export interface KdsOrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  instructions?: string
  options: KdsOrderOption[]
  badgeIds?: string[]
}

export interface KdsOrder {
  id: string
  queueNumber: string
  invoiceCode: string
  status: OrderStatus
  instructions?: string
  scheduledFor?: string | null
  fulfillmentMethodId: string
  fulfillmentName: string
  fulfillmentCategory: string
  createdAt: string
  grandTotal: number
  subtotal: number
  paymentMethodName: string | Record<string, string>
  items: KdsOrderItem[]
}

export type KdsBoardState = {
  [key in OrderStatus]?: KdsOrder[]
}
