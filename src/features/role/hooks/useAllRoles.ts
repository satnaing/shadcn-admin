import { useQuery } from '@tanstack/react-query'
import { roleService } from '../data/role.service'

export function useAllRoles() {
  return useQuery({
    queryKey: ['ALL_ROLES'],
    queryFn: () => roleService.allRoles(),
  })
}
