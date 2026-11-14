import {
  Boxes,
  Megaphone,
  Package,
  Palette,
  QrCode,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import type { MenuGroupRaw, MenuItemRaw } from '@/api/menu.types'
import type { NavGroup, NavItem } from '@/components/layout/types'

/** Icon names a module may declare in `admin_menu.group.icon`; unknown → Package. */
const ICONS: Record<string, React.ElementType> = {
  Boxes,
  Megaphone,
  Package,
  Palette,
  QrCode,
  ShoppingCart,
  Truck,
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order

const leaf = (item: MenuItemRaw) => ({
  key: item.key,
  title: item.key,
  url: item.route,
  permission: item.permission,
  anyPermission: item.anyPermission,
  badge: item.badge,
})

function toItem(item: MenuItemRaw, icon?: React.ElementType): NavItem {
  if (item.children?.length) {
    return {
      key: item.key,
      title: item.key,
      icon,
      items: [...item.children].sort(byOrder).map(leaf),
    }
  }
  return { ...leaf(item), icon }
}

/** `GET /admin/menu` groups → sidebar groups (sorted by `group.order`, items by `order`). */
export function toNavGroups(groups: MenuGroupRaw[] | null | undefined): NavGroup[] {
  return [...(Array.isArray(groups) ? groups : [])]
    .sort((a, b) => a.group.order - b.group.order)
    .map((g) => ({
      key: `module-${g.module}`,
      title: g.group.key,
      items: [...g.items]
        .sort(byOrder)
        .map((item) => toItem(item, ICONS[g.group.icon] ?? Package)),
    }))
}
