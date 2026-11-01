import { Outlet } from '@tanstack/react-router'
import { Bell, Monitor, Palette, UserCog, Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminSidebarPageShell } from '@/components/admin/admin-sidebar-page-shell'
import { ConfigDrawer } from '@/components/config-drawer'

export function Settings() {
  const { t } = useTranslation('settings')

  const sidebarNavItems = [
    {
      title: t('nav.profile'),
      href: '/settings',
      icon: <UserCog size={18} />,
    },
    {
      title: t('nav.account'),
      href: '/settings/account',
      icon: <Wrench size={18} />,
    },
    {
      title: t('nav.appearance'),
      href: '/settings/appearance',
      icon: <Palette size={18} />,
    },
    {
      title: t('nav.notifications'),
      href: '/settings/notifications',
      icon: <Bell size={18} />,
    },
    {
      title: t('nav.display'),
      href: '/settings/display',
      icon: <Monitor size={18} />,
    },
  ]

  return (
    <AdminSidebarPageShell
      title={t('title')}
      description={t('description')}
      sidebarItems={sidebarNavItems}
      beforeProfile={<ConfigDrawer />}
    >
      <Outlet />
    </AdminSidebarPageShell>
  )
}
