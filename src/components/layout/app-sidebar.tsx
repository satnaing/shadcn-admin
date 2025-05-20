import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
// import { NavUser } from '@/components/layout/nav-user'
import { sidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const LogoIcon = sidebarData.teams[0].logo;
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
       {/* Create a container with enough margin on the right to avoid overlap */}
       <div className="flex items-center px-0 py-2 mr-9">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <LogoIcon className="size-4" />
          </div>
          <div className="ml-3 text-sm font-semibold truncate">
            {sidebarData.teams[0].name}
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/*<NavUser user={sidebarData.user} />*/}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
