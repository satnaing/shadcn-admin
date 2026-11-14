/** `module.json` → `admin_menu` contract (task/admin/00-sidebar-architecture.md §2.1). */
export type MenuPanel = 'admin' | 'seller' | 'courier' | 'supervisor'

export interface MenuItemRaw {
  key: string
  route: string
  order: number
  permission?: string
  anyPermission?: string[]
  badge?: string
  requires_modules?: string[]
  children?: MenuItemRaw[]
}

export interface MenuGroupRaw {
  module: string
  group: { key: string; icon: string; order: number; panels: MenuPanel[] }
  items: MenuItemRaw[]
}

export interface ModuleRaw {
  id: string
  name: string
  description: string
  version: string
  icon: string
  required: boolean
  enabled: boolean
  requires: string[]
  admin_menu?: Omit<MenuGroupRaw, 'module'>
}
