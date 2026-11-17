import { PERMISSIONS } from '@/shared/permissions'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'

const TABS = [
  { id: 'all', permission: PERMISSIONS.WHOLESALE.INDEX },
  { id: 'inhouse', permission: PERMISSIONS.WHOLESALE.INHOUSE },
  { id: 'seller', permission: PERMISSIONS.WHOLESALE.SELLERS },
] as const

export type OwnerTab = (typeof TABS)[number]['id']

/** The active tab (`?owner=`) falls back to the first one the user may open. */
export function useOwnerTabs(search: Record<string, unknown>) {
  const has = usePermissionStore((s) => s.hasPermission)
  const tabs = TABS.filter((tab) => has(tab.permission)).map((tab) => tab.id)
  const asked = typeof search.owner === 'string' ? search.owner : undefined
  const active = (tabs.find((id) => id === asked) ??
    tabs[0] ??
    'all') as OwnerTab

  return { tabs, active }
}
