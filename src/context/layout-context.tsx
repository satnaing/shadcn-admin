import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type Variant = 'inset' | 'sidebar' | 'floating'

// Cookie constants following the pattern from sidebar.tsx
const LAYOUT_COLLAPSIBLE_COOKIE_NAME = 'layout_collapsible'
const LAYOUT_VARIANT_COOKIE_NAME = 'layout_variant'
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Default values
const DEFAULT_COLLAPSIBLE = 'icon'
const DEFAULT_VARIANT = 'floating'

interface LayoutContextType {
  collapsible: Collapsible
  setCollapsible: (collapsible: Collapsible) => void

  variant: Variant
  setVariant: (variant: Variant) => void
}

const LayoutContext = createContext<LayoutContextType>({
  collapsible: 'icon',
  setCollapsible: () => {},
  variant: 'floating',
  setVariant: () => {},
})

interface LayoutProviderProps {
  children: React.ReactNode
}

// Helper function to set cookie
function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; max-age=${LAYOUT_COOKIE_MAX_AGE}`
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [collapsible, setCollapsible] = useState<Collapsible>(
    () =>
      (Cookies.get(LAYOUT_COLLAPSIBLE_COOKIE_NAME) as Collapsible) ||
      DEFAULT_COLLAPSIBLE
  )
  const [variant, setVariant] = useState<Variant>(
    () =>
      (Cookies.get(LAYOUT_VARIANT_COOKIE_NAME) as Variant) || DEFAULT_VARIANT
  )

  useEffect(() => {
    setCookie(LAYOUT_COLLAPSIBLE_COOKIE_NAME, collapsible)
  }, [collapsible])

  useEffect(() => {
    setCookie(LAYOUT_VARIANT_COOKIE_NAME, variant)
  }, [variant])

  return (
    <LayoutContext.Provider
      value={{ collapsible, setCollapsible, variant, setVariant }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

// Define the hook for the provider
// eslint-disable-next-line react-refresh/only-export-components
export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
