import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiResponse } from '@/api/types'
import type { RoleFormValues } from './role.schema'
import type { Role } from './role.type'

export const roleKeys = {
  lists: () => ['ROLES'] as const,
  detail: (id: string) => ['ROLES', 'detail', id] as const,
}

export const roleService = {
  list: () => api.get<ApiResponse<Role[]>>(ENDPOINTS.ROLES.LIST),
  create: (payload: RoleFormValues) =>
    api.post<ApiResponse<Role>, RoleFormValues>(ENDPOINTS.ROLES.LIST, payload),
  update: (id: string, payload: RoleFormValues) =>
    api.put<ApiResponse<Role>, RoleFormValues>(ENDPOINTS.ROLES.ITEM(id), payload),
  delete: (id: string | number) => api.delete<ApiMessageResponse>(ENDPOINTS.ROLES.ITEM(id)),
}
