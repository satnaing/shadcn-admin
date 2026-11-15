import { useQuery } from '@tanstack/react-query'
import { themesApi } from '@/api/cms/themes.api'

export const DEFAULT_VARIANT = 'default'

/** The selector is only worth showing when the active theme offers a real choice. */
export const showVariantSelect = (variants: readonly string[] | undefined): boolean =>
  (variants?.length ?? 0) > 1

/** Variants declared by the active theme manifest (`variants[]`); `['default']` while unknown. */
export const useThemeVariants = (): string[] => {
  // Same key as themeKeys.list() so the Themes screens and this hook share one cache entry.
  const { data } = useQuery({ queryKey: ['THEMES', 'list'], queryFn: themesApi.list })
  const variants = data?.data?.find((theme) => theme.active)?.variants

  return variants?.length ? variants : [DEFAULT_VARIANT]
}
