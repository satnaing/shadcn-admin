import type { Staff } from '@/types/staff'
import { apiClient } from '@/lib/api-client'

// Helper for localized strings
const getLocal = (val: any) =>
  typeof val === 'object' && val !== null ? val.en || val.km || '' : val || ''

export const getStaffList = async (): Promise<Staff[]> => {
  const response = await apiClient.get('/admin/staff')
  return response.data.map((staff: any) => ({
    ...staff,
    access: (staff.shopAccess || []).map((access: any) => ({
      ...access,
      shop: access.shop
        ? {
            ...access.shop,
            name: getLocal(access.shop.name),
          }
        : undefined,
      role: access.role
        ? {
            ...access.role,
            name: getLocal(access.role.name),
            description: getLocal(access.role.description),
          }
        : undefined,
    })),
  }))
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
