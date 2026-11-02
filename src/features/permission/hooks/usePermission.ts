import { useQuery } from '@tanstack/react-query'
import { permissionService } from '../data/permission.service'

export function usePermission(id: string) {
  return useQuery({
    queryKey: ['PERMISSION_DETAIL', id],
    queryFn: () => permissionService.permission(id),
    enabled: !!id,
  })
}
