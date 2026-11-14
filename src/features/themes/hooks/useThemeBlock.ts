import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useThemeT } from './useThemeT'
import { themesApi } from '@/api/cms/themes.api'
import { themeKeys } from './useThemes'

/** One settings document per block (`topbar`, `header`, `footer`, `tokens`, `custom-code`). */
export const useThemeBlock = <S>(block: string) =>
  useQuery({
    queryKey: themeKeys.settings(block),
    queryFn: () => themesApi.getSettings<S>(block),
  })

export const useSaveThemeBlock = <S>(block: string) => {
  const queryClient = useQueryClient()
  const t = useThemeT()

  return useMutation({
    mutationFn: (value: S) => themesApi.saveSettings<S>(block, value),
    onSuccess: (_response, value) => {
      // Cache the saved document: the mock backend does not persist writes.
      queryClient.setQueryData(themeKeys.settings(block), { data: value })
      toast.success(t('common.saved'))
    },
    onError: () => toast.error(t('common.saveFailed')),
  })
}
