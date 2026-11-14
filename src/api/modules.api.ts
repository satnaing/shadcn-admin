import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiResponse } from '@/api/types'
import type { ModuleChange, ModuleItem, UploadResult } from '@/api/modules.types'

export const modulesApi = {
  list: () => api.get<ApiResponse<ModuleItem[]>>(ENDPOINTS.MODULES.LIST),
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
