import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { sidebarData } from './data/sidebar-data'
import { useAuth } from '@/context/auth-context'

// Map backend service_name to sidebar service keys
const serviceNameToKey = (name: string) => {
  if (name === 'User Management') return 'users'
  if (name === 'Inventory Management') return 'inventory'
  // Add more mappings as needed for your sidebar keys
  return name.toLowerCase().replace(/\s+/g, '-')
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Debug: log user object
  console.log('Sidebar user:', user)

  // Separate navGroups for 'Services' and 'Other'
  const servicesGroup = sidebarData.navGroups.find(
    (g) => g.title === 'General' || g.title === 'Services'
  )
  const otherGroups = sidebarData.navGroups.filter(
    (g) => g.title !== 'General' && g.title !== 'Services'
  )

  // For non-superadmin, build allowedServiceKeys from user.services if needed
  let allowedServiceKeys: string[] = []
  if (user && !user.is_super_admin && (user as any).services) {
    allowedServiceKeys = (user as any).services.map((s: any) =>
      serviceNameToKey(s.service_name)
    )
  } else if (user && !user.is_super_admin) {
    allowedServiceKeys = user.allowedServices || []
  }

  // Filter 'Services' group items
  let filteredServicesItems: typeof servicesGroup extends { items: infer T } ? T : any[] = []
  if (servicesGroup) {
    filteredServicesItems = servicesGroup.items.filter((item) => {
      // Always show Dashboard
      if (item.title === 'Dashboard') return true
      // If superadmin, show all
      if (user?.is_super_admin) return true
      // For others, check allowedServices (by key)
      const serviceKey = item.url?.replace('/', '')
      return serviceKey !== undefined && allowedServiceKeys.includes(serviceKey)
    })
  }

  // Compose filtered navGroups: always show 'Other' group and always show Dashboard in Services
  const filteredNavGroups = [
    servicesGroup ? { ...servicesGroup, items: filteredServicesItems } : null,
    ...otherGroups,
  ].filter(Boolean)

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map(
          (props) =>
            props && (
              <NavGroup
                key={props.title as string}
                {...props}
                title={props.title as string}
                items={props.items ?? []}
              />
            )
        )}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={sidebarData.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
