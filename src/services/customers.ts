import { type PaginationMeta } from '@/types/api'
import { type Customer, type CustomerStatus } from '@/types/growth'
import { apiClient } from '@/lib/api-client'

export const getCustomers = async (
  params?: Record<string, unknown>
): Promise<{
  data: Customer[]
  meta: PaginationMeta
}> => {
  const response = await apiClient.get('/admin/customers', { params })
  // API returns { items: [...], meta: {...} } — map to { data: [...], meta: {...} }
  return {
    data: response.data?.items ?? [],
    meta: response.data?.meta ?? {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  }
}

export const updateCustomerStatus = async (
  id: string,
  data: { status: CustomerStatus; reason?: string }
): Promise<void> => {
  await apiClient.patch(`/admin/customers/${id}/status`, data)
}
