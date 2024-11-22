import { createFileRoute, Outlet } from '@tanstack/react-router'
import Cookies from 'js-cookie'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SkipToMain />
      <AppSidebar />
      <main id='content' className='overflow-x-hidden h-full w-full'>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
