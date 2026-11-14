import {
  Blocks,
  FileText,
  LayoutDashboard,
  Newspaper,
  Palette,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { PERMISSIONS as P } from '@/shared/permissions'
import type { NavGroup } from '../types'
import { themesChildren } from './nav.core.themes'

/** Core sidebar, top to bottom. Module groups are appended after these (merge-sidebar.ts). */
export const navCore: NavGroup[] = [
  {
    key: 'overview',
    title: 'groups.overview',
    items: [
      { key: 'dashboard', title: 'dashboard', url: '/admin', icon: LayoutDashboard, permission: P.DASHBOARD.INDEX },
    ],
  },
  {
    key: 'content',
    title: 'groups.content',
    items: [
      { key: 'pages', title: 'pages', url: '/admin/pages', icon: FileText, permission: P.PAGES.INDEX },
      { key: 'blogs', title: 'blogs', url: '/admin/blogs', icon: Newspaper, permission: P.BLOGS.INDEX },
      { key: 'themes', title: 'themes', icon: Palette, items: themesChildren },
    ],
  },
  {
    key: 'system',
    title: 'groups.system',
    items: [
      { key: 'modules', title: 'modules', url: '/admin/modules', icon: Blocks, permission: P.MODULES.INDEX },
      { key: 'settings', title: 'settings', url: '/admin/settings', icon: Settings, permission: P.SETTINGS.INDEX },
      {
        key: 'rolePermission',
        title: 'rolePermission',
        icon: ShieldCheck,
        items: [
          { key: 'roles', title: 'roles', url: '/admin/roles', permission: P.ROLES.INDEX },
          { key: 'permissions', title: 'permissions', url: '/admin/permissions', permission: P.PERMISSIONS.INDEX },
        ],
      },
    ],
  },
]
