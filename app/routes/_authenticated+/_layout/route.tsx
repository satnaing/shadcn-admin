import { Outlet } from 'react-router'
import { AppSidebar } from '~/components/layout/app-sidebar'
import { SidebarProvider } from '~/components/ui/sidebar'
import { SearchProvider } from '~/context/search-context'
import { cn } from '~/lib/utils'

export default function DashboardLayout() {
  return (
    <SearchProvider>
      <SidebarProvider>
        <AppSidebar />
        <div
          id="content"
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh',
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
