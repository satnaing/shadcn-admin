import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { isPublicRoute } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})

function RootComponent() {
  if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Clerk Publishable Key')
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl='/sign-in'
      signInUrl='/sign-in'
      signUpUrl='/sign-up'
      signInFallbackRedirectUrl='/'
      signUpFallbackRedirectUrl='/'
    >
      <AuthWrapper />
    </ClerkProvider>
  )
}

function AuthWrapper() {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className='flex h-svh items-center justify-center'>
        <Loader2 className='size-8 animate-spin' />
      </div>
    )
  }
  
  // Check if current route is public
  const isPublic = isPublicRoute(location.pathname)
  
  // If not signed in and trying to access protected route, redirect to sign-in
  if (!isSignedIn && !isPublic) {
    navigate({ 
      to: '/sign-in', 
      search: { redirect: location.href },
      replace: true 
    })
    return null
  }
  
  // If signed in and trying to access auth pages, redirect to home
  if (isSignedIn && (location.pathname === '/sign-in' || location.pathname === '/sign-up')) {
    navigate({ to: '/', replace: true })
    return null
  }
  
  // For non-auth routes, wrap with AuthenticatedLayout
  const shouldWrapWithLayout = !isPublic && !['/sign-in', '/sign-up'].includes(location.pathname)
  
  return (
    <>
      <NavigationProgress />
      {shouldWrapWithLayout ? (
        <AuthenticatedLayout>
          <Outlet />
        </AuthenticatedLayout>
      ) : (
        <Outlet />
      )}
      <Toaster duration={5000} />
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  )
}
