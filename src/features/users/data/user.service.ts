import { requestInstanceClient } from '@/config/api'
import type { WithData, WithPagination } from '@/shared/types'
import { buildListQueryString } from '@/shared/utils/list-query-string'
import type { CreateUserFormValues, UpdateUserFormValues } from './schema'
import type { CurrentUserApiResponse, UserInterface } from './users.type'

export const userService = {
  currentUser: () => {
    return requestInstanceClient.get<CurrentUserApiResponse>('/auth/me')
  },
  users: (
    page = 1,
    limit = 10,
    sort = 'id',
    order = 'desc',
    status?: string
  ) => {
    const url = `/admin/users?${buildListQueryString({ page, per_page: limit, sort, order, status })}`

    return requestInstanceClient.get<WithPagination<UserInterface[]>>(url)
  },
  user: (id: string) => {
    return requestInstanceClient.get<WithData<UserInterface>>(
      `/admin/users/${id}`
    )
  },
  trash: (
    page = 1,
    limit = 10,
    sort = 'id',
    order = 'desc',
    status?: string
  ) => {
    const url = `/admin/users/trash?${buildListQueryString({ page, per_page: limit, sort, order, status })}`
    return requestInstanceClient.get<WithPagination<UserInterface[]>>(url)
  },
  create: (payload: CreateUserFormValues) => {
    return requestInstanceClient.post<void, CreateUserFormValues>(
      '/admin/users',
      payload
    )
  },
  update: (id: string, payload: UpdateUserFormValues) => {
    return requestInstanceClient.put<void, UpdateUserFormValues>(
      `/admin/users/${id}`,
      payload
    )
  },
  delete: (id: string) => {
    return requestInstanceClient.delete(`/admin/users/${id}`)
  },
  restore: (id: string) => {
    return requestInstanceClient.post(`/admin/users/${id}/restore`, {})
  },
  forceDelete: (id: string) => {
    return requestInstanceClient.delete(`/admin/users/${id}/force`)
  },
}

export interface UsersParams {
  page?: number
  per_page?: number
  sort?: string
  order?: string
  status?: string
}

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UsersParams) => [...userKeys.lists(), params] as const,
  trash: (params?: UsersParams) => [...userKeys.all, 'trash', params] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
}
