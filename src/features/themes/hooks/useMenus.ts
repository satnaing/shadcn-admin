import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useThemeT } from './useThemeT'
import { themesApi } from '@/api/cms/themes.api'
import type { MenuLocation, MenuNode, MenuSet } from '../data/themes.type'
import { themeKeys } from './useThemes'

export const useMenusQuery = () =>
  useQuery({ queryKey: themeKeys.menus(), queryFn: themesApi.menus })

export const useSaveMenu = () => {
  const queryClient = useQueryClient()
  const t = useThemeT()

  return useMutation({
    mutationFn: ({ location, items }: { location: MenuLocation; items: MenuNode[] }) =>
      themesApi.saveMenu(location, items),
    onSuccess: (_response, { location, items }) => {
      queryClient.setQueryData<{ data: MenuSet[] }>(themeKeys.menus(), (old) => ({
        data: (old?.data ?? []).map((menu) => (menu.location === location ? { ...menu, items } : menu)),
      }))
      toast.success(t('common.saved'))
    },
    onError: () => toast.error(t('common.saveFailed')),
  })
}
