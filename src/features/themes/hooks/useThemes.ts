import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useThemeT } from './useThemeT'
import { themesApi } from '@/api/cms/themes.api'

export const themeKeys = {
  all: ['THEMES'] as const,
  list: () => [...themeKeys.all, 'list'] as const,
  compat: (id: string) => [...themeKeys.all, 'compat', id] as const,
  settings: (block: string) => [...themeKeys.all, 'settings', block] as const,
  menus: () => [...themeKeys.all, 'menus'] as const,
  banners: () => [...themeKeys.all, 'banners'] as const,
  group: (group: string) => [...themeKeys.all, 'group', group] as const,
}

export const useThemesQuery = () =>
  useQuery({ queryKey: themeKeys.list(), queryFn: themesApi.list })

export const useActiveTheme = () => useThemesQuery().data?.data?.find((theme) => theme.active)

export const useCompatibilityQuery = (id: string | null) =>
  useQuery({
    queryKey: themeKeys.compat(id ?? ''),
    queryFn: () => themesApi.compatibility(id ?? ''),
    enabled: id !== null,
  })

export const useActivateTheme = () => {
  const queryClient = useQueryClient()
  const t = useThemeT()

  return useMutation({
    mutationFn: themesApi.activate,
    onSuccess: () => {
      toast.success(t('themesPage.activated'))
      void queryClient.invalidateQueries({ queryKey: themeKeys.all })
    },
    onError: () => toast.error(t('common.saveFailed')),
  })
}
