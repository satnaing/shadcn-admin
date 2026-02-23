import type {
  CreateSurchargeDto,
  SurchargeConfig,
  UpdateSurchargeDto,
} from '@/types/api'
import { apiClient } from '@/lib/api-client'

export const getSurcharges = async (): Promise<SurchargeConfig[]> => {
  const response = await apiClient.get('/admin/surcharges')
  return response.data
}

export const createSurcharge = async (
  data: CreateSurchargeDto
): Promise<SurchargeConfig> => {
  const response = await apiClient.post('/admin/surcharges', data)
  return response.data
}

export const updateSurcharge = async (
  id: string,
  data: UpdateSurchargeDto
): Promise<SurchargeConfig> => {
  const response = await apiClient.put(`/admin/surcharges/${id}`, data)
  return response.data
}

export const toggleSurchargeStatus = async (
  id: string
): Promise<SurchargeConfig> => {
  const response = await apiClient.patch(`/admin/surcharges/${id}`)
  return response.data
}
