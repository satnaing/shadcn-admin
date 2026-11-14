import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useThemeT } from './useThemeT'
import { themesApi } from '@/api/cms/themes.api'
import type { Banner, BannerDraft, BannerGroupSettings } from '../data/themes.type'
import { themeKeys } from './useThemes'

type BannerList = { data: Banner[] }

export const useBannersQuery = (params: { group?: string; locale?: string }) =>
  useQuery({
    queryKey: [...themeKeys.banners(), params],
    queryFn: () => themesApi.banners(params),
  })

/** Patches every cached banner list: the mock backend does not persist writes. */
const useBannerCache = () => {
  const queryClient = useQueryClient()
  return (patch: (rows: Banner[]) => Banner[]) =>
    queryClient.setQueriesData<BannerList>({ queryKey: themeKeys.banners() }, (old) =>
      old ? { data: patch(old.data) } : old
    )
}

export const useBannerMutations = () => {
  const t = useThemeT()
  const patchCache = useBannerCache()
  const onError = () => toast.error(t('common.saveFailed'))
  const done = () => toast.success(t('common.saved'))

  const create = useMutation({
    mutationFn: (draft: BannerDraft) => themesApi.createBanner(draft),
    onSuccess: (response, draft) => {
      patchCache((rows) => [...rows, { ...draft, id: response.data?.id ?? Date.now(), order: rows.length + 1 }])
      done()
    },
    onError,
  })

  const update = useMutation({
    mutationFn: ({ id, draft }: { id: number; draft: BannerDraft }) => themesApi.updateBanner(id, draft),
    onSuccess: (_response, { id, draft }) => {
      patchCache((rows) => rows.map((row) => (row.id === id ? { ...row, ...draft } : row)))
      done()
    },
    onError,
  })

  const remove = useMutation({
    mutationFn: themesApi.deleteBanner,
    onSuccess: (_response, id) => {
      patchCache((rows) => rows.filter((row) => row.id !== id))
      done()
    },
    onError,
  })

  const toggle = useMutation({
    mutationFn: themesApi.toggleBanner,
    onSuccess: (_response, id) =>
      patchCache((rows) => rows.map((row) => (row.id === id ? { ...row, enabled: !row.enabled } : row))),
    onError,
  })

  const reorder = useMutation({
    mutationFn: themesApi.reorderBanners,
    onSuccess: (_response, ids) =>
      patchCache((rows) =>
        ids.flatMap((id, index) => {
          const row = rows.find((item) => item.id === id)
          return row ? [{ ...row, order: index + 1 }] : []
        })
      ),
    onError,
  })

  return { create, update, remove, toggle, reorder }
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
