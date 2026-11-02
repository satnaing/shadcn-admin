import { useQuery } from '@tanstack/react-query'
import { permissionService } from '../data/permission.service'

export function usePermissions(sort = 'id', order = 'desc') {
  return useQuery({
    queryKey: ['PERMISSIONS', { sort, order }],
    queryFn: () => permissionService.permissions(sort, order),
  })
}
