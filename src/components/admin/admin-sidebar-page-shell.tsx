import type { ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { SidebarNav } from '@/features/settings/components/sidebar-nav'
import { AdminHeader } from './admin-header'

export type SidebarNavItem = {
  href: string
  title: string
  icon: React.ReactElement
}

interface AdminSidebarPageShellProps {
  title: string
  description: string
  sidebarItems: SidebarNavItem[]
  beforeProfile?: ReactNode
  showLocaleSwitcher?: boolean
  children: ReactNode
}

export function AdminSidebarPageShell({
  title,
  description,
  sidebarItems,
  beforeProfile,
  showLocaleSwitcher = false,
  children,
}: AdminSidebarPageShellProps) {
  return (
    <>
      <AdminHeader
        beforeProfile={beforeProfile}
        showLocaleSwitcher={showLocaleSwitcher}
      />
      <Main fluid>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {title}
          </h1>
          <p className='text-muted-foreground'>{description}</p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>{children}</div>
        </div>
      </Main>
    </>
  )
}
