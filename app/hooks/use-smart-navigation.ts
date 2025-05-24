import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

/**
 * A smart navigation hook that can automatically save the current location and provide a goBack function.
 *
 * @param options - Configuration options for the smart navigation
 * @param options.autoSave - Whether to automatically save the current location to sessionStorage. Defaults to false.
 * @param options.baseUrl - The base URL of the nested route. Used as the storage key and fallback URL. Defaults to '/'.
 *
 * @returns An object containing the goBack function and backUrl
 * @returns goBack - A function that navigates back to the saved location or fallback URL
 * @returns backUrl - The saved URL or base URL that goBack will navigate to
 *
 * @example
 * ```typescript
 * // Usage on a list page - automatically save current location with filters/pagination
 * const { goBack } = useSmartNavigation({
 *   autoSave: true,
 *   baseUrl: '/tasks'
 * })
 *
 * // Usage on a detail page - provide goBack function to return to saved list location
 * const { goBack, backUrl } = useSmartNavigation({
 *   autoSave: false,
 *   baseUrl: '/tasks'
 * })
 *
 * // Navigate back to saved list location (e.g., on save/cancel button)
 * goBack()
 *
 * // Or use backUrl for Link component
 * <Link to={backUrl}>Back to List</Link>
 * ```
 */
export function useSmartNavigation(options?: {
  autoSave?: boolean
  baseUrl?: string
}) {
  const location = useLocation()
  const navigate = useNavigate()

  const { autoSave = false, baseUrl = '/' } = options || {}

  // 自動保存
  useEffect(() => {
    if (autoSave && baseUrl === location.pathname) {
      sessionStorage.setItem(
        `nav_${baseUrl}`,
        location.pathname + location.search,
      )
    }
  }, [location, baseUrl, autoSave])

  // SSR-safe fallback
  const getBackUrl = () => {
    if (typeof window === 'undefined') return baseUrl // SSR
    const savedUrl = sessionStorage.getItem(`nav_${baseUrl}`)
    return savedUrl || baseUrl
  }

  const goBack = () => {
    navigate(getBackUrl())
  }

  return {
    goBack,
    backUrl: getBackUrl(),
  }
}
