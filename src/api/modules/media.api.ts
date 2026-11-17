import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiResponse } from '@/api/types'
import type { MediaRef } from '@/components/shared/media/media.type'
import { buildListQueryString } from '@/shared/utils/list-query-string'

export const mediaApi = {
  list: (params: { q?: string; type?: string; page?: number }) =>
    api.get<ApiResponse<MediaRef[]>>(`${ENDPOINTS.MEDIA.LIST}?${buildListQueryString({ per_page: 24, ...params })}`),
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<ApiResponse<MediaRef>>(ENDPOINTS.MEDIA.LIST, form)
  },
  remove: (id: number | string) => api.delete<ApiMessageResponse>(ENDPOINTS.MEDIA.ITEM(id)),
}
