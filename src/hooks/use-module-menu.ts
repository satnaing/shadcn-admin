import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/api/types'
import type { MenuGroupRaw, MenuPanel } from '@/api/menu.types'
import { toNavGroups } from '@/api/adapters/menu.adapter'

export const MENU_KEY = ['MENU'] as const

/**
 * Module-declared sidebar groups for a panel. After toggling/installing a module,
 * invalidate `MENU_KEY`. API down → no module groups (core menu still renders).
 */
export function useModuleMenu(panel: MenuPanel) {
  const router = useRouter()
  const { data } = useQuery({
    queryKey: [...MENU_KEY, panel],
    queryFn: () =>
      api.get<ApiResponse<MenuGroupRaw[]>>(`${ENDPOINTS.MENU}?panel=${panel}`),
    staleTime: 60_000,
    retry: 0,
  })

  return toNavGroups(data?.data, Object.keys(router.routesByPath))
}
