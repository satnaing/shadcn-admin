import { type ComponentType, type LazyExoticComponent, lazy } from 'react'
import { Bell, Coins, Globe, Languages, Mail, Search, type LucideIcon } from 'lucide-react'
import { PERMISSIONS } from '@/shared/permissions'

export const SETTINGS_TAB_IDS = ['general', 'languages', 'seo', 'currency', 'email', 'notifications'] as const
export type SettingsTabId = (typeof SETTINGS_TAB_IDS)[number]

interface SettingsTab {
  id: SettingsTabId
  permission: string
  icon: LucideIcon
  Component: LazyExoticComponent<ComponentType>
}

const S = PERMISSIONS.SETTINGS

/** Each tab is its own lazy chunk. */
export const SETTINGS_TABS: SettingsTab[] = [
  { id: 'general', permission: S.GENERAL, icon: Globe, Component: lazy(() => import('./components/general-tab')) },
  { id: 'languages', permission: S.LANGUAGES, icon: Languages, Component: lazy(() => import('./components/languages-tab')) },
  { id: 'seo', permission: S.SEO, icon: Search, Component: lazy(() => import('./components/seo-tab')) },
  { id: 'currency', permission: S.CURRENCY, icon: Coins, Component: lazy(() => import('./components/currency-tab')) },
  { id: 'email', permission: S.EMAIL, icon: Mail, Component: lazy(() => import('./components/email-tab')) },
  { id: 'notifications', permission: S.NOTIFICATIONS, icon: Bell, Component: lazy(() => import('./components/notifications-tab')) },
]
