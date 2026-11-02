import { requestInstanceClient } from '@/config/api'
import { type WithPagination } from '@/shared/types'
import {
  type DeliveryStatus,
  type OrderFilterParams,
  type OrderItem,
  type PaymentStatus,
} from './orders.type'

export const ordersService = {
  async getList(
    params?: OrderFilterParams
  ): Promise<WithPagination<OrderItem[]>> {
    const response = await requestInstanceClient.get<
      WithPagination<OrderItem[]>
    >('/admin/orders', { params })
    return response
  },

  async getById(id: number | string): Promise<{ data: OrderItem }> {
    const response = await requestInstanceClient.get<{ data: OrderItem }>(
      `/admin/orders/${id}`
    )
    return response
  },

  async updateDeliveryStatus(
    id: number | string,
    delivery_status: DeliveryStatus
  ): Promise<{ message: string }> {
    return requestInstanceClient.patch(`/admin/orders/${id}/delivery-status`, {
      delivery_status,
    })
  },

  async updatePaymentStatus(
    id: number | string,
    payment_status: PaymentStatus
  ): Promise<{ message: string }> {
    return requestInstanceClient.patch(`/admin/orders/${id}/payment-status`, {
      payment_status,
    })
  },

  async delete(id: number | string): Promise<{ message: string }> {
    return requestInstanceClient.delete(`/admin/orders/${id}`)
  },
}
