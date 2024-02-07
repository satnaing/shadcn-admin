import { Outlet } from 'react-router-dom'
import {
  IconBrowserCheck,
  IconExclamationCircle,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { Search } from '@/components/search'
import { Separator } from '@/components/ui/separator'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  return (
    <div className='relative flex flex-col after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:hidden after:h-32 after:w-full after:bg-[linear-gradient(180deg,_transparent_10%,_hsl(var(--background))_70%)] md:h-svh after:md:block'>
      {/* ===== Top Heading ===== */}
      <div className='flex h-16 flex-none items-center gap-4 bg-background p-4 md:px-8'>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </div>

      <div className='flex h-[calc(100%-4rem)] flex-1 flex-col overflow-hidden px-4 pb-6 pt-6 md:px-10'>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-6' />
        <div className='flex flex-1 flex-col space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='sticky top-0 lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='w-full p-1 pr-4 lg:max-w-xl'>
            <div className='pb-16'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/settings',
  },
  {
    title: 'Account',
    icon: <IconTool size={18} />,
    href: '/settings/account',
  },
  {
    title: 'Appearance',
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  {
    title: 'Notifications',
    icon: <IconNotification size={18} />,
    href: '/settings/notifications',
  },
  {
    title: 'Display',
    icon: <IconBrowserCheck size={18} />,
    href: '/settings/display',
  },
  {
    title: 'Error Example',
    icon: <IconExclamationCircle size={18} />,
    href: '/settings/error-example',
  },
]
