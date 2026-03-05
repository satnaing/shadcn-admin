import { type PaginationMeta } from '@/types/api'
import type { Staff } from '@/types/staff'
import { apiClient } from '@/lib/api-client'

interface LocalizedText {
  en: string
  km?: string
}

interface RawShopAccess {
  shop?: { id: string; name: LocalizedText }
  role?: {
    id: string
    name: LocalizedText
    description?: LocalizedText
  }
  [key: string]: any
}

interface RawStaff extends Omit<Staff, 'access'> {
  shopAccess?: RawShopAccess[]
}

// Helper for localized strings
const getLocal = (val: unknown): string => {
  if (val && typeof val === 'object') {
    const v = val as Record<string, string>
    return v.en || v.km || ''
  }
  return (val as string) || ''
}

export const getStaffList = async (
  params?: Record<string, unknown>
): Promise<{ data: Staff[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/staff', {
    params,
  })
  const { items, data, meta } = response.data
  const rawData = items || data || []

  return {
    data: (rawData as RawStaff[]).map((staff) => ({
      ...(staff as unknown as Staff),
      access: (staff.shopAccess || []).map((access) => ({
        ...(access as any),
        shop: access.shop
          ? {
              ...access.shop,
              name: getLocal(access.shop.name),
            }
          : undefined,
        role: access.role
          ? {
              ...access.role,
              // Keep as objects to match Role interface in types/staff.ts
              name: access.role.name,
              description: access.role.description,
            }
          : undefined,
      })),
    })),
    meta,
  }
}

export const createStaff = async (
  data: Record<string, unknown>
): Promise<Staff> => {
  const response = await apiClient.post('/admin/staff', data)
  return response.data
}

export const assignShopAccess = async (
  staffId: string,
  data: { shopId: string; roleId: string }
): Promise<void> => {
  await apiClient.post(`/admin/staff/${staffId}/shop-access`, data)
}

export const removeShopAccess = async (
  staffId: string,
  shopId: string
): Promise<void> => {
  await apiClient.delete(`/admin/staff/${staffId}/shop-access/${shopId}`)
}
