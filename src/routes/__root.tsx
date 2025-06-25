import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Outlet,
  useNavigate,
  useSearch,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'
import React from 'react'
import { z } from 'zod'

function RootComponent() {
  const navigate = useNavigate()
  const { auth_token: urlToken } = useSearch({ from: Route.id })

  React.useEffect(() => {
    if (urlToken) {
      // An auth_token was found in the URL. We'll store it in a cookie.
      console.log('auth_token found in URL, storing in cookie.')
      // This sets a session cookie that expires when the browser is closed.
      // For a persistent cookie, you could add `max-age=<seconds>`.
      document.cookie = `auth_token=${urlToken}; path=/; SameSite=Lax`

      // Clean the token from the URL for security and aesthetic reasons.
      window.history.replaceState({}, document.title, window.location.pathname)
      // Since we just set the token, we can allow rendering to proceed.
      return
    }

    // If no token was in the URL, check if one exists in the cookies.
    const tokenFromCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))

    if (!tokenFromCookie) {
      // No token found in URL or cookies, redirect to sign-in.
      console.log('No auth_token found, redirecting to sign-in.')
      navigate({ to: '/sign-in', replace: true })
    }
  }, [navigate, urlToken])

  return (
    <>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={50000} />
      {import.meta.env.MODE === 'development' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  validateSearch: z.object({
    auth_token: z.string().optional(),
  }),
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
