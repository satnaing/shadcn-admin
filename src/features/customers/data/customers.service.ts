import { requestInstanceClient } from '@/config/api'
import { type WithPagination } from '@/shared/types'
import {
  type ClassifiedProductItem,
  type CustomerFilterParams,
  type CustomerItem,
  type CustomerPackageItem,
} from './customers.type'

export const customersService = {
  async getCustomers(
    params?: CustomerFilterParams
  ): Promise<WithPagination<CustomerItem[]>> {
    return requestInstanceClient.get<WithPagination<CustomerItem[]>>(
      '/admin/customers',
      { params }
    )
  },

  async getCustomerById(id: number | string): Promise<{ data: CustomerItem }> {
    return requestInstanceClient.get<{ data: CustomerItem }>(
      `/admin/customers/${id}`
    )
  },

  async toggleBan(
    id: number | string,
    is_banned: boolean
  ): Promise<{ message: string }> {
    return requestInstanceClient.patch(`/admin/customers/${id}/ban`, {
      is_banned,
    })
  },

  async deleteCustomer(id: number | string): Promise<{ message: string }> {
    return requestInstanceClient.delete(`/admin/customers/${id}`)
  },

  async getClassifiedProducts(params?: {
    search?: string
    page?: number
  }): Promise<WithPagination<ClassifiedProductItem[]>> {
    return requestInstanceClient.get<WithPagination<ClassifiedProductItem[]>>(
      '/admin/customers/classified-products',
      { params }
    )
  },

  async toggleClassifiedProductStatus(
    id: number | string,
    is_published: boolean
  ): Promise<{ message: string }> {
    return requestInstanceClient.patch(
      `/admin/customers/classified-products/${id}/status`,
      { is_published }
    )
  },

  async addClassifiedProduct(
    payload: Partial<ClassifiedProductItem>
  ): Promise<{ message: string }> {
    return requestInstanceClient.post(
      '/admin/customers/classified-products',
      payload
    )
  },

  async deleteClassifiedProduct(
    id: number | string
  ): Promise<{ message: string }> {
    return requestInstanceClient.delete(
      `/admin/customers/classified-products/${id}`
    )
  },

  async getPackages(): Promise<{ data: CustomerPackageItem[] }> {
    return requestInstanceClient.get<{ data: CustomerPackageItem[] }>(
      '/admin/customers/packages'
    )
  },

  async savePackage(
    payload: Partial<CustomerPackageItem>
  ): Promise<{ message: string }> {
    if (payload.id) {
      return requestInstanceClient.put(
        `/admin/customers/packages/${payload.id}`,
        payload
      )
    }
    return requestInstanceClient.post('/admin/customers/packages', payload)
  },

  async deletePackage(id: number | string): Promise<{ message: string }> {
    return requestInstanceClient.delete(`/admin/customers/packages/${id}`)
  },
}
