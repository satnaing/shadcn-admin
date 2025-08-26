import { dark } from '@clerk/themes'

// Define Clerk appearance configuration type
type ClerkAppearance = {
  baseTheme?: any
  elements?: Record<string, string>
  variables?: Record<string, string>
}

// Clerk theme configuration that matches your app's light/dark theme
export const clerkAppearance = {
  light: {
    baseTheme: undefined, // Use Clerk's default light theme
    elements: {
      // User button specific
      userButtonPopoverCard: 'shadow-lg',

      // Avatar
      avatarBox: 'rounded-lg',
    },
    variables: {
      colorPrimary: 'hsl(var(--primary))',
      borderRadius: '0.5rem',
    },
  } satisfies ClerkAppearance,

  dark: {
    baseTheme: dark, // Use Clerk's built-in dark theme as base
    elements: {
      // User button specific
      userButtonBox: 'shadow-sm',
      userButtonPopoverCard: 'shadow-lg',

      // Avatar
      avatarBox: 'rounded-lg',
    },
    variables: {
      colorPrimary: 'hsl(var(--primary))',
      borderRadius: '0.5rem',
      colorDanger: 'hsl(var(--destructive))',
    },
  } satisfies ClerkAppearance,
}

// Hook to get the appropriate Clerk appearance based on current theme
export function useClerkAppearance(resolvedTheme: 'light' | 'dark') {
  return clerkAppearance[resolvedTheme]
}
