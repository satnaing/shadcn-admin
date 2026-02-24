import { apiClient } from '@/lib/api-client'
import type { Role, Permission } from '@/features/settings/data/role-schema'

// Helper to extract localized string
const getLocal = (val: any) =>
  typeof val === 'object' && val !== null ? val.en || val.km || '' : val || ''

// Helper to convert string to localized object
const setLocal = (val: string | undefined) => (val ? { en: val } : undefined)

export const getRoles = async (
  params?: Record<string, unknown>
): Promise<Role[]> => {
  const response = await apiClient.get('/admin/roles', { params })
  return response.data.map((r: any) => ({
    ...r,
    name: getLocal(r.name),
    description: getLocal(r.description),
    usersCount: r.usersCount || 0,
    permissions: r.permissions?.map((p: any) => p.permissionId) || [],
  }))
}

export const getPermissions = async (): Promise<Permission[]> => {
  const response = await apiClient.get('/admin/permissions')
  return response.data.map((p: any) => ({
    ...p,
    // Assuming backend permissions might have localized description/name
    label: getLocal(p.label ?? p.name ?? p.slug),
    description: getLocal(p.description),
  }))
}

export const createRole = async (data: any): Promise<Role> => {
  const payload = {
    ...data,
    name: setLocal(data.name),
    description: setLocal(data.description),
  }
  const response = await apiClient.post('/admin/roles', payload)
  return response.data
}

export const updateRole = async (id: string, data: any): Promise<Role> => {
  const payload = {
    ...data,
    ...(data.name && { name: setLocal(data.name) }),
    ...(data.description !== undefined && {
      description: setLocal(data.description),
    }),
  }
  const response = await apiClient.patch(`/admin/roles/${id}`, payload)
  return response.data
}

export const deleteRole = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/roles/${id}`)
}
