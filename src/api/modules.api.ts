import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiResponse } from '@/api/types'
import { buildListQueryString } from '@/shared/utils/list-query-string'
import type { ModuleChange, ModuleListParams, ModuleItem, UploadResult } from '@/api/modules.types'

export const modulesApi = {
  list: (params: ModuleListParams = {}) =>
    api.get<ApiResponse<ModuleItem[]>>(`${ENDPOINTS.MODULES.LIST}?${buildListQueryString(params)}`),
  saveBatch: (changes: ModuleChange[]) =>
    api.post<ApiMessageResponse>(ENDPOINTS.MODULES.BATCH, { changes }),
  update: (id: string) => api.post<ApiMessageResponse>(ENDPOINTS.MODULES.UPDATE(id)),
  remove: (id: string) => api.delete<ApiMessageResponse>(ENDPOINTS.MODULES.ITEM(id)),
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<ApiResponse<UploadResult>>(ENDPOINTS.MODULES.UPLOAD, form)
  },
}
