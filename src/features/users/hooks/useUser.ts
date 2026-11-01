import { useQuery } from '@tanstack/react-query'
import { userKeys, userService } from '../data/user.service'

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.user(id),
    enabled: !!id,
  })
}
