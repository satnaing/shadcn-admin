import { useQuery } from '@tanstack/react-query'
import { User, userListSchema } from '../data/schema'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface UsersQueryParams {
  page?: number
  pageSize?: number
  status?: string[]
  role?: string[]
  username?: string
}

interface UsersResponse {
  data: User[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

async function fetchUsers(params: UsersQueryParams): Promise<UsersResponse> {
  const url = new URL(`${API_BASE_URL}/users`, window.location.origin)
  if (params.page) url.searchParams.set('page', params.page.toString())
  if (params.pageSize)
    url.searchParams.set('pageSize', params.pageSize.toString())
  if (params.status?.length)
    url.searchParams.set('status', params.status.join(','))
  if (params.role?.length) url.searchParams.set('role', params.role.join(','))
  if (params.username) url.searchParams.set('username', params.username)

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`)
  const responseData: UsersResponse = await response.json()
  const validatedData = userListSchema.parse(responseData.data)

  return {
    data: validatedData,
    pagination: responseData.pagination,
  }
}

export function useUsersQuery(params: UsersQueryParams = {}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  })
}
