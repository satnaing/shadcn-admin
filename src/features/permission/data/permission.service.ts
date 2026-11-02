import { requestInstanceClient } from '@/config/api'
import type { NamedEntityInterface } from '@/shared/types'
import { type PermissionFormValues } from './permission.schema'
import type {
  PermissionsApiResponse,
  SinglePermissionApiResponse,
} from './permission.type'

export const permissionKeys = {
  lists: () => ['PERMISSIONS'] as const,
  detail: (id: string) => ['PERMISSION_DETAIL', id] as const,
}

export const permissionService = {
  permissions: (sort = 'id', order = 'desc') => {
    return requestInstanceClient.get<PermissionsApiResponse>(
      `/admin/permissions?sort=${sort}&order=${order}`
    )
  },
  allPermissions: () => {
    return requestInstanceClient.get<NamedEntityInterface[]>(
      `/admin/permissions/all`
    )
  },
  permission: (id: string) => {
    return requestInstanceClient.get<SinglePermissionApiResponse>(
      `/admin/permissions/${id}`
    )
  },
  create: (data: PermissionFormValues) => {
    return requestInstanceClient.post<unknown, PermissionFormValues>(
      '/admin/permissions',
      data
    )
  },
  delete: (id: string | number) => {
    return requestInstanceClient.delete(`/admin/permissions/${id}`)
  },
  update: (id: string, data: PermissionFormValues) => {
    return requestInstanceClient.put<unknown, PermissionFormValues>(
      `/admin/permissions/${id}`,
      data
    )
  },
}
