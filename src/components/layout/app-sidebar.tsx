import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { getPanelByRole } from '@/config/panels'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { useAuthStore } from '@/features/auth/data/auth.store'
import { useModuleMenu } from '@/hooks/use-module-menu'
import { DevRoleSwitcher } from '@/components/dev-role-switcher'
import { AppSidebarSkeleton } from './app-sidebar-skeleton'
import { mergeSidebar } from './data/merge-sidebar'
import { navCore } from './data/nav.core'
import { NavGroup } from './nav-group'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const hasPermission = usePermissionStore((s) => s.hasPermission)
  const loading = usePermissionStore((s) => s.loading)
  const user = useAuthStore((s) => s.user)

  const panel =
    user?.panel ?? getPanelByRole(user?.role ?? user?.roles?.[0]?.name) ?? 'admin'
  const navGroups = mergeSidebar(navCore, useModuleMenu(panel), hasPermission)

  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      className='border-r border-sidebar-border p-0 [&>div]:rounded-none!'
    >
      <SidebarHeader className='flex h-14 shrink-0 items-center border-b border-sidebar-border px-4'>
        <TeamSwitcher />
      </SidebarHeader>
      {loading && <AppSidebarSkeleton />}
      <SidebarContent className='px-2 py-4'>
        {navGroups.map((props) => (
          <NavGroup key={props.key} title={props.title} items={props.items} />
        ))}
      </SidebarContent>
      <SidebarFooter className='border-t border-sidebar-border'>
        <DevRoleSwitcher />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
