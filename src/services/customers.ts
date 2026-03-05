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
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
    },
  }
}

export const updateCustomerStatus = async (
  id: string,
  data: { status: CustomerStatus; reason?: string }
): Promise<void> => {
  await apiClient.patch(`/admin/customers/${id}/status`, data)
}
