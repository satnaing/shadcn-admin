import type { Customer, CustomerStatus } from '@/types/growth'
import { apiClient } from '@/lib/api-client'

export const getCustomers = async (
  params?: Record<string, unknown>
): Promise<{ data: Customer[]; meta: any }> => {
  const response = await apiClient.get('/admin/customers', { params })
  return response.data
}

export const updateCustomerStatus = async (
  id: string,
  data: { status: CustomerStatus; reason?: string }
): Promise<void> => {
  await apiClient.patch(`/admin/customers/${id}/status`, data)
}
