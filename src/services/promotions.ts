import { type PaginationMeta } from '@/types/api'
import { type Promotion } from '@/types/growth'
import { apiClient } from '@/lib/api-client'
import type { CreatePromotionDto } from '@/features/growth/promotions/types'

interface RawPromotion extends Omit<Promotion, 'name' | 'description'> {
  name: unknown
  description: unknown
}

export const getPromotions = async (params?: {
  page?: number
  limit?: number
}): Promise<{
  data: Promotion[]
  meta?: PaginationMeta
}> => {
  const response = await apiClient.get('/admin/promotions', { params })

  const rawData: RawPromotion[] =
    response.data?.data || response.data?.items || []
  const meta = response.data?.meta

  const promotions: Promotion[] = rawData.map((p) => {
    // In case value is a string from API
    const numericValue =
      typeof p.value === 'string' ? parseFloat(p.value) : p.value

    return {
      ...p,
      value: numericValue,
      startDate: p.startDate ?? p.validFrom,
      endDate: p.endDate ?? p.validUntil,
      name:
        typeof p.name === 'string'
          ? { en: p.name }
          : (p.name as { en: string; km?: string }) || { en: '' },
      description:
        typeof p.description === 'string'
          ? { en: p.description }
          : (p.description as { en: string; km?: string }) || { en: '' },
    }
  })

  return { data: promotions, meta }
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

export const generateVouchers = async (args: {
  promotionId: string
  quantity: number
  userId?: string
}) => {
  const { promotionId, quantity, userId } = args
  const response = await apiClient.post(
    `/admin/promotions/${promotionId}/generate-vouchers`,
    { promotionId, quantity, userId }
  )
  return response.data
}
