import type {
  CreatePaymentMethodDto,
  PaymentMethod,
  UpdatePaymentMethodDto,
} from '@/types/api'
import { apiClient } from '@/lib/api-client'

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await apiClient.get('/admin/payment-methods')
  return response.data
}

export const getPaymentMethodById = async (
  id: string
): Promise<PaymentMethod> => {
  const response = await apiClient.get(`/admin/payment-methods/${id}`)
  return response.data
}

export const createPaymentMethod = async (
  data: CreatePaymentMethodDto
): Promise<PaymentMethod> => {
  const response = await apiClient.post('/admin/payment-methods', data)
  return response.data
}

export const updatePaymentMethod = async (
  id: string,
  data: UpdatePaymentMethodDto
): Promise<PaymentMethod> => {
  const response = await apiClient.patch(`/admin/payment-methods/${id}`, data)
  return response.data
}

export const togglePaymentMethodStatus = async (
  id: string,
  isActive: boolean
): Promise<PaymentMethod> => {
  const response = await apiClient.patch(`/admin/payment-methods/${id}`, {
    isActive,
  })
  return response.data
}
