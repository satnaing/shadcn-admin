import { PERMISSIONS as P } from '@/shared/permissions'
import type { NavCollapsible } from '../types'

export const themesChildren: NavCollapsible['items'] = [
  { key: 'themesList', title: 'themesList', url: '/admin/themes', permission: P.THEMES.INDEX },
  { key: 'topbar', title: 'topbar', url: '/admin/themes/topbar', permission: P.THEMES.TOPBAR },
  { key: 'header', title: 'header', url: '/admin/themes/header', permission: P.THEMES.HEADER },
  { key: 'menu', title: 'menu', url: '/admin/themes/menu', permission: P.THEMES.MENU },
  { key: 'footer', title: 'footer', url: '/admin/themes/footer', permission: P.THEMES.FOOTER },
  { key: 'banners', title: 'banners', url: '/admin/themes/banners', permission: P.THEMES.BANNERS },
  { key: 'tokens', title: 'tokens', url: '/admin/themes/tokens', permission: P.THEMES.TOKENS },
  { key: 'customCode', title: 'customCode', url: '/admin/themes/custom-code', permission: P.THEMES.CUSTOM_CODE },
]
