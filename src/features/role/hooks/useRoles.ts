import { useQuery } from '@tanstack/react-query'
import { roleService } from '@/features/role/data/role.service.ts'

export function useRoles(sort = 'id', order = 'desc') {
  return useQuery({
    queryKey: ['ROLES', { sort, order }],
    queryFn: () => roleService.roles(sort, order),
  })
}
