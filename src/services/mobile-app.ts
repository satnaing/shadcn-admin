import { apiClient } from '@/lib/api-client'
import type { MobileAppVersion } from '@/features/settings/data/mobile-app-schema'

export const getMobileVersions = async (
  params?: Record<string, unknown>
): Promise<MobileAppVersion[]> => {
  const response = await apiClient.get('/admin/mobile-versions', { params })
  return response.data.map((v: any) => ({
    ...v,
    version: v.latestVersion,
    releaseDate: v.createdAt,
    status: 'published', // Assuming backend doesn't track this explicitly
  }))
}

export const createMobileVersion = async (
  data: any
): Promise<MobileAppVersion> => {
  const response = await apiClient.post('/admin/mobile-versions', {
    ...data,
    latestVersion: data.version,
  })
  return response.data
}

export const updateMobileVersion = async (
  id: string,
  data: any
): Promise<MobileAppVersion> => {
  const response = await apiClient.patch(`/admin/mobile-versions/${id}`, {
    ...data,
    latestVersion: data.version,
  })
  return response.data
}

export const deleteMobileVersion = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/mobile-versions/${id}`)
}
