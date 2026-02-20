import { hqNav, getStoreNav } from '@/config/nav'
import { useLayout } from '@/context/layout-provider'
import { useAppStore } from '@/hooks/use-app-store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { ShopSwitcher } from './shop-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { activeShopId, user, shops } = useAppStore()

  // Map Staff object to NavUser expected format
  const navUser = user
    ? {
        name: user.fullName || user.username,
        email: user.username,
        avatar: '', // Add avatar to Staff if available, else empty
      }
    : sidebarData.user

  const activeShop = shops.find((s) => s.id === activeShopId)
  const storeNav = getStoreNav(activeShopId)

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <ShopSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {/* Store Operations Group */}
        <NavGroup
          title={`Store: ${activeShop?.code || 'Select Shop'}`}
          items={storeNav}
        />

        <SidebarSeparator className='mx-0' />

        {/* Head Office Group */}
        <NavGroup title='Head Office' items={hqNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
