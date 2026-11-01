import { type LinkProps } from '@tanstack/react-router'




type User = {
  name: string
  email: string
  avatar: string
}

type Team = {
  name: string
  logo: React.ElementType
  plan: string
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
  key: string
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
  permission?: string
  /**
   * Any one of these is enough. Used where the same screen is reachable with
   * either the global or the own-scoped right — a seller holding only
   * `sales.view_own` still needs the link.
   */
  anyPermission?: string[]
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & {
    permission?: string
    anyPermission?: string[]
    url: LinkProps['to'] | (string & {})
  })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  key: string
  items: NavItem[]
}

type SidebarData = {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }
