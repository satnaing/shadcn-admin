import { apiClient } from '@/lib/api-client'
import type { MobileAppVersion } from '@/features/settings/data/mobile-app-schema'

export const getMobileVersions = async (
  params?: Record<string, unknown>
): Promise<MobileAppVersion[]> => {
  const response = await apiClient.get('/admin/mobile-versions', { params })
  const rawData = response.data?.items ?? response.data?.data ?? response.data
  const versionsArray = Array.isArray(rawData) ? rawData : []
  return versionsArray.map((v: any) => ({
    ...v,
    version: v.latestVersion,
    releaseDate: v.createdAt,
    status: 'published',
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
