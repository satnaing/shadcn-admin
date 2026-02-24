import type { Promotion } from '@/types/growth'
import { apiClient } from '@/lib/api-client'
import type { CreatePromotionDto } from '@/features/growth/promotions/types'

export const getPromotions = async (): Promise<Promotion[]> => {
  const response = await apiClient.get('/admin/promotions')
  return response.data
}

export const createPromotion = async (data: CreatePromotionDto) => {
  const response = await apiClient.post('/admin/promotions', data)
  return response.data
}

export const updatePromotion = async (args: {
  id: string
  data: Partial<CreatePromotionDto>
}) => {
  const { id, data } = args
  const response = await apiClient.patch(`/admin/promotions/${id}`, data)
  return response.data
}
