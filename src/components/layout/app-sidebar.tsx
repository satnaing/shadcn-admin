import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { AppSidebarSkeleton } from './app-sidebar-skeleton'
import { filterSidebarByPermissions } from './data/data.lib'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const hasPermission = usePermissionStore((s) => s.hasPermission)
  const loading = usePermissionStore((s) => s.loading)

  const navGroups = filterSidebarByPermissions(
    sidebarData.navGroups,
    hasPermission
  )

  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      className='border-r border-sidebar-border p-0 [&>div]:rounded-none!'
    >
      <SidebarHeader className='flex h-14 shrink-0 items-center border-b border-sidebar-border px-4'>
        <TeamSwitcher />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      {loading && <AppSidebarSkeleton />}
      <SidebarContent className='px-2 py-4'>
        {navGroups.map((props) => (
          <NavGroup key={props.key} title={props.title} items={props.items} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
