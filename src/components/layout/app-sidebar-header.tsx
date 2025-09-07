import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SwanLogo } from '@/components/swan-logo'

export function TeamSwitcher() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' className='cursor-default hover:bg-transparent'>
          <div>
            <SwanLogo
              symbolOnly={isCollapsed}
              className={isCollapsed ? 'ml-1 h-6 w-6' : 'h-6 w-auto'}
            />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
