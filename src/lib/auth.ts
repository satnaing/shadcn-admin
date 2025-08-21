import { redirect } from '@tanstack/react-router'

// List of public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/401',
  '/403',
  '/404',
  '/500',
  '/503',
]

// Check if a route is public
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

// Get the auth state for route guards
export async function getAuthState() {
  // This will be called in the route's beforeLoad
  // For client-side, we'll use the useAuth hook from Clerk
  return {
    isLoaded: true,
    userId: null, // This will be populated by Clerk
  }
}

// Require authentication for a route
export function requireAuth({ location }: { location: { pathname: string; href: string } }) {
  if (isPublicRoute(location.pathname)) {
    return
  }
  
  // This will be called in beforeLoad guards
  // The actual auth check will be done using Clerk's auth state
  throw redirect({
    to: '/sign-in',
    search: {
      redirect: location.href,
    },
  })
}

// Parse redirect URL from search params
export function getRedirectUrl(search: Record<string, unknown>): string {
  const redirectUrl = search?.redirect as string
  
  if (!redirectUrl) {
    return '/'
  }
  
  // Ensure the redirect is a relative URL for security
  try {
    const url = new URL(redirectUrl, window.location.origin)
    if (url.origin === window.location.origin) {
      return url.pathname + url.search + url.hash
    }
  } catch {
    // If parsing fails, default to home
  }
  
  return '/'
}
