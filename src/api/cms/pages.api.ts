import { apiClient } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiPaginatedResponse, ApiResponse } from '@/api/types'
import type {
  PageCreatePayload,
  PageDetail,
  PageListParams,
  PageRevision,
  PageRow,
  PageSection,
  PageSettingsPayload,
  PageTemplate,
  SectionCatalogItem,
} from '@/features/pages/data/pages.type'

const query = (params: PageListParams) =>
  new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key, String(value)])
  ).toString()

export const pagesApi = {
  list: (params: PageListParams = {}) =>
    apiClient.get<ApiPaginatedResponse<PageRow[]>>(`${ENDPOINTS.PAGES.LIST}?${query(params)}`),
  show: (id: number) => apiClient.get<ApiResponse<PageDetail>>(ENDPOINTS.PAGES.ITEM(id)),
  create: (payload: PageCreatePayload) =>
    apiClient.post<ApiResponse<PageRow>>(ENDPOINTS.PAGES.LIST, payload),
  update: (id: number, payload: PageSettingsPayload) =>
    apiClient.put<ApiMessageResponse>(ENDPOINTS.PAGES.ITEM(id), payload),
  remove: (id: number) => apiClient.delete<ApiMessageResponse>(ENDPOINTS.PAGES.ITEM(id)),
  saveDraft: (id: number, sections: PageSection[]) =>
    apiClient.patch<ApiResponse<{ saved_at: string }>>(ENDPOINTS.PAGES.DRAFT(id), { sections }),
  publish: (id: number) => apiClient.post<ApiMessageResponse>(ENDPOINTS.PAGES.PUBLISH(id)),
  revisions: (id: number) =>
    apiClient.get<ApiResponse<PageRevision[]>>(ENDPOINTS.PAGES.REVISIONS(id)),
  restore: (id: number, revisionId: number) =>
    apiClient.post<ApiMessageResponse>(ENDPOINTS.PAGES.RESTORE(id, revisionId)),
  previewToken: (id: number) =>
    apiClient.post<ApiResponse<{ token: string; url: string }>>(ENDPOINTS.PAGES.PREVIEW_TOKEN(id)),
  templates: () => apiClient.get<ApiResponse<PageTemplate[]>>(ENDPOINTS.PAGES.TEMPLATES),
  sectionCatalog: () =>
    apiClient.get<ApiResponse<SectionCatalogItem[]>>(ENDPOINTS.PAGES.SECTION_CATALOG),
}
