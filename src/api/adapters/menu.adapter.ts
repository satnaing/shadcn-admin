import {
  Boxes,
  CalendarClock,
  Megaphone,
  Package,
  Palette,
  QrCode,
  RotateCcw,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import type { MenuGroupRaw, MenuItemRaw } from '@/api/menu.types'
import type { NavGroup, NavItem } from '@/components/layout/types'

/** Icon names a module may declare in `admin_menu.group.icon`; unknown → Package. */
const ICONS: Record<string, React.ElementType> = {
  Boxes,
  CalendarClock,
  Megaphone,
  Package,
  Palette,
  QrCode,
  RotateCcw,
  ShoppingCart,
  Truck,
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order

const norm = (path: string) => path.split('?')[0].replace(/\/+$/, '') || '/'

/** Does a registered (non-splat) route match `url`? `$param` segments match any segment. */
export function routeExists(url: string, routePaths: readonly string[]): boolean {
  const target = norm(url).split('/')
  return routePaths.some((path) => {
    const parts = norm(path).split('/')
    return (
      !parts.includes('$') &&
      parts.length === target.length &&
      parts.every((part, i) => part.startsWith('$') || part === target[i])
    )
  })
}

const leafOf = (item: MenuItemRaw, routePaths?: readonly string[]) => ({
  key: item.key,
  title: item.key,
  url: item.route,
  permission: item.permission,
  anyPermission: item.anyPermission,
  badge: item.badge,
  // routePaths omitted (unknown) -> never disable
  disabled: routePaths ? !routeExists(item.route, routePaths) : undefined,
})

function toItem(
  item: MenuItemRaw,
  icon?: React.ElementType,
  routePaths?: readonly string[]
): NavItem {
  if (item.children?.length) {
    return {
      key: item.key,
      title: item.key,
      icon,
      items: [...item.children].sort(byOrder).map((c) => leafOf(c, routePaths)),
    }
  }
  return { ...leafOf(item, routePaths), icon }
}

/**
 * `GET /admin/menu` groups → sidebar groups (sorted by `group.order`, items by `order`).
 * Pass the router's registered paths to mark screens that do not exist yet as `disabled`.
 */
export function toNavGroups(
  groups: MenuGroupRaw[] | null | undefined,
  routePaths?: readonly string[]
): NavGroup[] {
  return [...(Array.isArray(groups) ? groups : [])]
    .sort((a, b) => a.group.order - b.group.order)
    .map((g) => ({
      key: `module-${g.module}`,
      title: g.group.key,
      items: [...g.items]
        .sort(byOrder)
        .map((item) => toItem(item, ICONS[g.group.icon] ?? Package, routePaths)),
    }))
}
