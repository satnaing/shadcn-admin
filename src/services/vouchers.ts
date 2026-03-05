import { type PaginationMeta } from '@/types/api'
import type { Voucher } from '@/types/growth'
import { apiClient } from '@/lib/api-client'

export const getVouchers = async (
  params?: Record<string, unknown>
): Promise<{ data: Voucher[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/promotions/vouchers', { params })
  const { data, meta } = response.data

  return {
    data: data.map((v: any) => ({
      id: v.id,
      uniqueCode: v.uniqueCode,
      promotionName: v.promotion?.name || 'Unknown',
      userPhone: v.user?.phone || 'Guest',
      isRedeemed: v.isRedeemed,
      createdAt: new Date(v.createdAt).toLocaleDateString(),
    })),
    meta,
  }
}
