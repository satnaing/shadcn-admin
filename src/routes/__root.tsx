import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet, useLocation } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { isFullscreenRoute, isPublicRoute } from '@/lib/auth'
import { GraphQLProvider } from '@/lib/graphql'
import { useClerkAppearance } from '@/lib/clerk-theme'
import { useTheme } from '@/context/theme-provider'

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

  const { resolvedTheme } = useTheme()
  const appearance = useClerkAppearance(resolvedTheme)

  return (
    <ClerkProvider
      appearance={appearance}
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
  const location = useLocation()
  
  // Check if current route is public
  const isPublic = isPublicRoute(location.pathname)
  const isFullscreen = isFullscreenRoute(location.pathname)
  
  // If route is public, render without authentication checks
  if (isPublic) {
    return (
      <GraphQLProvider>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={5000} richColors />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </GraphQLProvider>
    )
  }

  // For OAuth callback routes, use authentication but no sidebar
  if (isFullscreen) {
    return (
      <GraphQLProvider>
        <NavigationProgress />
        <SignedIn>
          <Outlet />
        </SignedIn>
        <SignedOut>
          <Outlet />
        </SignedOut>
        <Toaster duration={5000} richColors />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </GraphQLProvider>
    )
  }

  // For protected routes, use Clerk's authentication components
  return (
    <GraphQLProvider>
      <NavigationProgress />
      <SignedIn>
        <AuthenticatedLayout>
          <Outlet />
        </AuthenticatedLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl={location.href}/>
      </SignedOut>
      <Toaster duration={5000} richColors/>
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='top-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </GraphQLProvider>
  )
}
