import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { type BannerListParams, themesApi } from '@/api/cms/themes.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { BannerDraft, BannerGroupSettings } from '../data/themes.type'
import { useThemeT } from './useThemeT'
import { themeKeys } from './useThemes'

export const useBannersQuery = (params: BannerListParams) =>
  usePaginatedQuery({
    queryKey: [...themeKeys.banners(), params],
    queryFn: () => themesApi.banners(params),
  })

export const useBannerMutations = () => {
  const t = useThemeT()
  const queryClient = useQueryClient()
  const onError = () => toast.error(t('common.saveFailed'))
  // The mock backend keeps writes in memory, so a refetch shows the truth (and the right page).
  const onSuccess = (silent = false) => () => {
    void queryClient.invalidateQueries({ queryKey: themeKeys.banners() })
    if (!silent) toast.success(t('common.saved'))
  }

  return {
    create: useMutation({ mutationFn: (draft: BannerDraft) => themesApi.createBanner(draft), onSuccess: onSuccess(), onError }),
    update: useMutation({
      mutationFn: ({ id, draft }: { id: number; draft: BannerDraft }) => themesApi.updateBanner(id, draft),
      onSuccess: onSuccess(),
      onError,
    }),
    remove: useMutation({ mutationFn: themesApi.deleteBanner, onSuccess: onSuccess(), onError }),
    toggle: useMutation({ mutationFn: themesApi.toggleBanner, onSuccess: onSuccess(true), onError }),
    reorder: useMutation({ mutationFn: themesApi.reorderBanners, onSuccess: onSuccess(true), onError }),
  }
}

export const useGroupSettings = (group: string) =>
  useQuery({
    queryKey: themeKeys.group(group),
    queryFn: () => themesApi.groupSettings(group),
    enabled: Boolean(group),
  })

export const useSaveGroupSettings = () => {
  const queryClient = useQueryClient()
  const t = useThemeT()

  return useMutation({
    mutationFn: themesApi.saveGroupSettings,
    onSuccess: (_response, value: BannerGroupSettings) => {
      queryClient.setQueryData(themeKeys.group(value.group), { data: value })
      toast.success(t('common.saved'))
    },
    onError: () => toast.error(t('common.saveFailed')),
  })
}
