import { requestInstanceClient } from '@/config/api'
import { type WithPagination } from '@/shared/types'
import {
  type ClassifiedFilterParams,
  type ClassifiedProductItem,
} from './classified.type'

export const classifiedService = {
  async getProducts(
    params?: ClassifiedFilterParams
  ): Promise<WithPagination<ClassifiedProductItem[]>> {
    return requestInstanceClient.get<WithPagination<ClassifiedProductItem[]>>(
      '/admin/classified-products',
      { params }
    )
  },

  async getProductById(
    id: number | string
  ): Promise<{ data: ClassifiedProductItem }> {
    return requestInstanceClient.get<{ data: ClassifiedProductItem }>(
      `/admin/classified-products/${id}`
    )
  },

  async toggleStatus(
    id: number | string,
    is_published: boolean
  ): Promise<{ message: string }> {
    return requestInstanceClient.patch(
      `/admin/classified-products/${id}/status`,
      { is_published }
    )
  },

  async createProduct(
    payload: Partial<ClassifiedProductItem>
  ): Promise<{ message: string; data?: ClassifiedProductItem }> {
    return requestInstanceClient.post(
      '/admin/classified-products',
      payload
    )
  },

  async updateProduct(
    id: number | string,
    payload: Partial<ClassifiedProductItem>
  ): Promise<{ message: string }> {
    return requestInstanceClient.put(
      `/admin/classified-products/${id}`,
      payload
    )
  },

  async deleteProduct(id: number | string): Promise<{ message: string }> {
    return requestInstanceClient.delete(`/admin/classified-products/${id}`)
  },
}
