import { useQuery } from '@tanstack/react-query'
import { roleService } from '../data/role.service'

export function useRole(id: string) {
  return useQuery({
    queryKey: ['ROLE_DETAIL', id],
    queryFn: () => roleService.role(id),
    enabled: !!id,
  })
}
