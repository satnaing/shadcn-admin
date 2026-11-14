import type { NavGroup } from '../types'
import { filterSidebarByPermissions } from './data.lib'

/** Core groups first (fixed order), then module groups (already ordered by `group.order`). */
export function mergeSidebar(
  core: NavGroup[],
  moduleGroups: NavGroup[],
  hasPermission: (permission: string) => boolean
): NavGroup[] {
  return filterSidebarByPermissions([...core, ...moduleGroups], hasPermission)
}
