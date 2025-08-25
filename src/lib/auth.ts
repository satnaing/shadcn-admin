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

export const FULLSCREEN_ROUTES = [
  '/oauth/callback',
]

// Check if a route is public
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

export function isFullscreenRoute(pathname: string): boolean {
  return FULLSCREEN_ROUTES.some(route => pathname.startsWith(route))
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
