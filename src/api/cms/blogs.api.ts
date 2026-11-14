import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiPaginatedResponse, ApiResponse } from '@/api/types'
import { buildListQueryString } from '@/shared/utils/list-query-string'
import type {
  BlogCategoryDetail,
  BlogCategoryListItem,
  BlogDetail,
  BlogListItem,
  BlogListParams,
} from '@/features/blogs/data/blogs.type'

const query = (params: BlogListParams) => buildListQueryString({ ...params })

export const blogsApi = {
  list: (params: BlogListParams = {}) =>
    api.get<ApiPaginatedResponse<BlogListItem[]>>(`${ENDPOINTS.BLOGS.LIST}?${query(params)}`),
  show: (id: number | string) => api.get<ApiResponse<BlogDetail>>(ENDPOINTS.BLOGS.ITEM(id)),
  create: (payload: unknown) => api.post<ApiMessageResponse>(ENDPOINTS.BLOGS.LIST, payload),
  update: (id: number | string, payload: unknown) =>
    api.put<ApiMessageResponse>(ENDPOINTS.BLOGS.ITEM(id), payload),
  remove: (id: number | string) => api.delete<ApiMessageResponse>(ENDPOINTS.BLOGS.ITEM(id)),

  categories: (params: BlogListParams = {}) =>
    api.get<ApiPaginatedResponse<BlogCategoryListItem[]>>(
      `${ENDPOINTS.BLOGS.CATEGORIES}?${query(params)}`
    ),
  category: (id: number | string) =>
    api.get<ApiResponse<BlogCategoryDetail>>(ENDPOINTS.BLOGS.CATEGORY(id)),
  createCategory: (payload: unknown) =>
    api.post<ApiMessageResponse>(ENDPOINTS.BLOGS.CATEGORIES, payload),
  updateCategory: (id: number | string, payload: unknown) =>
    api.put<ApiMessageResponse>(ENDPOINTS.BLOGS.CATEGORY(id), payload),
  removeCategory: (id: number | string) =>
    api.delete<ApiMessageResponse>(ENDPOINTS.BLOGS.CATEGORY(id)),
}
