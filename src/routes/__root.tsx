import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { Session } from '@supabase/supabase-js'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import useAuth from '@/features/auth/hooks/useAuth'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'
// Create a proper React component
function RootComponent() {
  useAuth()

  return (
    <>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={50000} />
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-right' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  )
}

// Use the named component in your route
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  auth: {
    isSignedIn: boolean
    isSessionLoaded: boolean
    session: Session | null
  }
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
