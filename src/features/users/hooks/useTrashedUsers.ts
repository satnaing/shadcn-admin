import { usePaginatedQuery as useQuery } from '@/hooks/use-paginated-query'
import { userKeys, userService } from '../data/user.service'

export function useTrashedUsers(
  page = 1,
  limit = 10,
  sort = 'id',
  order = 'desc',
  status?: string
) {
  return useQuery({
    queryKey: userKeys.trash({ page, per_page: limit, sort, order, status }),
    queryFn: () => userService.trash(page, limit, sort, order, status),
  })
}
