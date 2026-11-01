import { requestInstanceClient } from '@/config/api'
import type { NamedEntityInterface } from '@/shared/types'
import type { RoleFormValues } from './role.schema'
import type { RolesApiResponse, SingleRoleApiResponse } from './role.type'

export const roleKeys = {
  lists: () => ['ROLES'] as const,
  detail: (id: string) => ['ROLE_DETAIL', id] as const,
}

export const roleService = {
  roles: (sort = 'id', order = 'desc') => {
    return requestInstanceClient.get<RolesApiResponse>(
      `/admin/roles?sort=${sort}&order=${order}`
    )
  },
  allRoles: () => {
    return requestInstanceClient.get<NamedEntityInterface[]>('/admin/roles/all')
  },
  role: (id: string) => {
    return requestInstanceClient.get<SingleRoleApiResponse>(
      `/admin/roles/${id}`
    )
  },
  create: (data: RoleFormValues) => {
    return requestInstanceClient.post<unknown, RoleFormValues>(
      '/admin/roles',
      data
    )
  },
  delete: (id: string | number) => {
    return requestInstanceClient.delete(`/admin/roles/${id}`)
  },
  update: (id: string, data: RoleFormValues) => {
    return requestInstanceClient.put<unknown, RoleFormValues>(
      `/admin/roles/${id}`,
      data
    )
  },
}
