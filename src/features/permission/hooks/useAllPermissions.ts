import { useQuery } from '@tanstack/react-query'
import { permissionService } from '../data/permission.service'

export function useAllPermissions() {
  return useQuery({
    queryKey: ['ALL_PERMISSIONS'],
    queryFn: () => permissionService.allPermissions(),
  })
}
