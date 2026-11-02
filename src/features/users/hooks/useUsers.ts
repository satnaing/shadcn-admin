import { usePaginatedQuery as useQuery } from '@/hooks/use-paginated-query'
import { userKeys, userService } from '../data/user.service'

export function useUsers(
  page = 1,
  limit = 10,
  sort = 'id',
  order = 'desc',
  status?: string
) {
  return useQuery({
    queryKey: userKeys.list({ page, per_page: limit, sort, order, status }),
    queryFn: () => userService.users(page, limit, sort, order, status),
  })
}
