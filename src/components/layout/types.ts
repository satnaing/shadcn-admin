import { LinkProps } from '@tanstack/react-router'

interface User {
  name: string
  email: string
  avatar: string
}


interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
}

type NavLink = BaseNavItem & {
  url: LinkProps['to']
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

interface NavGroup {
  title: string
  items: NavItem[]
}



interface BottomGroups {
  title: string
  items: NavItem[]
}



interface SidebarData {
  user: User
  navGroups: NavGroup[]
  bottomGroups : BottomGroups[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink, BottomGroups }
