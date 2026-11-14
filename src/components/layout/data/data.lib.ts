import { isNotNull } from '@/shared/helper'
import type { SidebarData } from '../types'

type Guarded = { permission?: string; anyPermission?: string[] }

/**
 * `anyPermission` wins when present: the item is reachable with any one of the
 * listed rights, which is how an own-scoped screen stays visible to someone who
 * only holds the narrow permission.
 */
function isVisible(item: Guarded, hasPermission: (p: string) => boolean) {
  if (item.anyPermission?.length) {
    return item.anyPermission.some(hasPermission)
  }

  return !item.permission || hasPermission(item.permission)
}

export function filterSidebarByPermissions(
  navGroups: SidebarData['navGroups'],
  hasPermission: (p: string) => boolean
) {
  return navGroups
    .map((group) => {
      const items = group.items
        .map((item) => {
          // leaf — empty permission = visible to every authenticated admin
          if (item.url) {
            return isVisible(item, hasPermission) ? item : null
          }

          // parent
          if (item.items) {
            const children = item.items
              .map((child) => (isVisible(child, hasPermission) ? child : null))
              .filter(isNotNull)

            return children.length ? { ...item, items: children } : null
          }

          return null
        })
        .filter(isNotNull)

      return items.length ? { ...group, items } : null
    })
    .filter(isNotNull) // 🔑 GROUP LEVEL
}
