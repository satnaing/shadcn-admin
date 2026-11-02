import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { getPanelByRole, type Panel } from '@/config/panels'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { useAuthStore } from '@/features/auth/data/auth.store'
import { AppSidebarSkeleton } from './app-sidebar-skeleton'
import { filterSidebarByPermissions } from './data/data.lib'
import { sidebarAdminData } from './data/sidebar-data.admin'
import { sidebarCourierData } from './data/sidebar-data.courier'
import { sidebarSellerData } from './data/sidebar-data.seller'
import { sidebarSupervisorData } from './data/sidebar-data.supervisor'
import { NavGroup } from './nav-group'
import { TeamSwitcher } from './team-switcher'
import type { SidebarData } from './types'

const sidebarMap: Record<Panel, SidebarData> = {
  admin: sidebarAdminData,
  seller: sidebarSellerData,
  courier: sidebarCourierData,
  supervisor: sidebarSupervisorData,
}

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const hasPermission = usePermissionStore((s) => s.hasPermission)
  const loading = usePermissionStore((s) => s.loading)
  const user = useAuthStore((s) => s.user)

  const userRole = user?.role ?? user?.roles?.[0]?.name
  const currentPanel: Panel = user?.panel ?? getPanelByRole(userRole) ?? 'admin'
  const currentSidebarData = sidebarMap[currentPanel] ?? sidebarAdminData

  const navGroups = filterSidebarByPermissions(
    currentSidebarData.navGroups,
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
