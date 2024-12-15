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
          id='content'
          className={cn(
            'max-w-full w-full ml-auto',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon))]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] ease-linear duration-200',
            'h-svh flex flex-col'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
