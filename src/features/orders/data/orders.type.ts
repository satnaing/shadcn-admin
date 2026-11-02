export type DeliveryStatus =
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled'

export type PaymentStatus = 'paid' | 'unpaid'

export interface OrderItemProduct {
  id: number
  product_id: number
  product_name: string
  product_thumbnail?: string
  variation?: string
  quantity: number
  unit_price: number
  tax: number
  total: number
}

export interface ShippingAddress {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code?: string
  country: string
}

export interface OrderItem {
  id: number
  code: string
  user_id: number | null
  customer_name: string
  customer_email: string
  customer_phone: string
  seller_id: number | null
  seller_name: string
  delivery_status: DeliveryStatus
  payment_status: PaymentStatus
  payment_type: string
  grand_total: number
  coupon_discount: number
  shipping_cost: number
  tax_amount: number
  subtotal: number
  shipping_address: ShippingAddress
  shipping_type: 'home_delivery' | 'pickup_point'
  pickup_point_name?: string
  delivery_boy_name?: string
  items_count: number
  items: OrderItemProduct[]
  date: string
}

export interface OrderFilterParams {
  search?: string
  delivery_status?: DeliveryStatus | 'all'
  payment_status?: PaymentStatus | 'all'
  seller_id?: number | 'all'
  shipping_type?: 'home_delivery' | 'pickup_point' | 'all'
  date?: string
  page?: number
  per_page?: number
}
