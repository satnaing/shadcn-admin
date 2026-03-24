import { Outlet } from '@tanstack/react-router'
import { Monitor, Bell, Palette, Wrench, UserCog } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SidebarNav } from './components/sidebar-nav'
import { useTranslation } from 'react-i18next'

export function Settings() {
  const { t } = useTranslation('settings')

  const sidebarNavItems = [
    {
      title: t('profile') || 'Profile',
      href: '/settings',
      icon: <UserCog size={18} />,
    },
    {
      title: t('account') || 'Account',
      href: '/settings/account',
      icon: <Wrench size={18} />,
    },
    {
      title: t('appearance') || 'Appearance',
      href: '/settings/appearance',
      icon: <Palette size={18} />,
    },
    {
      title: t('notifications') || 'Notifications',
      href: '/settings/notifications',
      icon: <Bell size={18} />,
    },
    {
      title: t('display') || 'Display',
      href: '/settings/display',
      icon: <Monitor size={18} />,
    },
  ]

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('title') || 'Settings'}
          </h1>
          <p className='text-muted-foreground'>
            {t('description') || 'Manage your account settings and set e-mail preferences.'}
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}
