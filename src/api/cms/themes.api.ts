import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/api/types'
import type { WithPagination } from '@/shared/types'
import { buildListQueryString, type ListQueryParams } from '@/shared/utils/list-query-string'
import type {
  Banner,
  BannerDraft,
  BannerGroupSettings,
  MenuLocation,
  MenuNode,
  MenuSet,
  ThemeCompatibility,
  ThemeSummary,
} from '@/features/themes/data/themes.type'

const T = ENDPOINTS.THEMES

export type BannerListParams = ListQueryParams & { group?: string; locale?: string }

export const themesApi = {
  list: () => api.get<ApiResponse<ThemeSummary[]>>(T.LIST),
  compatibility: (id: string) => api.get<ApiResponse<ThemeCompatibility[]>>(T.COMPATIBILITY(id)),
  activate: (id: string) => api.post<ApiResponse<{ id: string }>>(T.ACTIVATE(id)),

  getSettings: <S>(block: string) => api.get<ApiResponse<S>>(T.SETTINGS(block)),
  saveSettings: <S>(block: string, value: S) => api.put<ApiResponse<S>, S>(T.SETTINGS(block), value),

  menus: () => api.get<ApiResponse<MenuSet[]>>(T.MENUS),
  saveMenu: (location: MenuLocation, items: MenuNode[]) =>
    api.put<ApiResponse<MenuSet>, { items: MenuNode[] }>(T.MENU(location), { items }),

  banners: (params: BannerListParams) =>
    api.get<WithPagination<Banner[]>>(`${T.BANNERS}?${buildListQueryString(params)}`),
  createBanner: (draft: BannerDraft) => api.post<ApiResponse<Banner>, BannerDraft>(T.BANNERS, draft),
  updateBanner: (id: number, draft: BannerDraft) =>
    api.put<ApiResponse<Banner>, BannerDraft>(T.BANNER(id), draft),
  deleteBanner: (id: number) => api.delete<{ message: string }>(T.BANNER(id)),
  toggleBanner: (id: number) => api.patch<ApiResponse<Banner>>(T.BANNER_TOGGLE(id)),
  reorderBanners: (ids: number[]) =>
    api.put<{ message: string }, { ids: number[] }>(T.BANNER_REORDER, { ids }),
  groupSettings: (group: string) => api.get<ApiResponse<BannerGroupSettings>>(T.BANNER_GROUP(group)),
  saveGroupSettings: (value: BannerGroupSettings) =>
    api.put<ApiResponse<BannerGroupSettings>, BannerGroupSettings>(T.BANNER_GROUP(value.group), value),
}
