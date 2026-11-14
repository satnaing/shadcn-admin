import { useQuery } from '@tanstack/react-query'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import { blogsApi } from '@/api/cms/blogs.api'
import type { BlogListParams } from '../data/blogs.type'

export const blogKeys = {
  all: ['BLOGS'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (p: BlogListParams) => [...blogKeys.lists(), p] as const,
  detail: (id: number | string) => [...blogKeys.all, 'detail', id] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
  categoryList: (p: BlogListParams) => [...blogKeys.categories(), p] as const,
  category: (id: number | string) => [...blogKeys.categories(), 'detail', id] as const,
}

export const useBlogs = (params: BlogListParams) =>
  usePaginatedQuery({ queryKey: blogKeys.list(params), queryFn: () => blogsApi.list(params) })

export const useBlog = (id?: string) =>
  useQuery({
    queryKey: blogKeys.detail(id ?? ''),
    queryFn: () => blogsApi.show(id ?? ''),
    enabled: !!id,
  })

export const useBlogCategories = (params: BlogListParams = {}) =>
  usePaginatedQuery({
    queryKey: blogKeys.categoryList(params),
    queryFn: () => blogsApi.categories(params),
  })

export const useBlogCategory = (id?: number) =>
  useQuery({
    queryKey: blogKeys.category(id ?? 0),
    queryFn: () => blogsApi.category(id ?? 0),
    enabled: !!id,
  })
