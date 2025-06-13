import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import MainLoader from '@/components/main-loader'
import SkipToMain from '@/components/skip-to-main'
import { useGetUserQuery } from '@/features/auth/query/user.query'
import GeneralError from '@/features/errors/general-error'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const defaultOpen = Cookies.get('sidebar_state') !== 'false'

  const isSignedIn = useAuthStore((state) => state?.session?.user?.id)
  const isSessionLoaded = useAuthStore((state) => state?.isSessionLoaded)
  const { data: user, isFetched, isLoading } = useGetUserQuery()

  useEffect(() => {
    if (isSessionLoaded && !isSignedIn) {
      navigate({ to: '/sign-in' })
    }
  }, [isSessionLoaded, isSignedIn, navigate])

  if (!isSessionLoaded || (!isFetched && isLoading)) return <MainLoader />
  if (!user && isFetched && !isLoading) return <GeneralError />

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'sm:transition-[width] sm:duration-200 sm:ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
