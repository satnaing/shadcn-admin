import { useQuery } from '@tanstack/react-query'
import { pagesApi } from '@/api/cms/pages.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PageListParams } from '../data/pages.type'

export const pageKeys = {
  all: ['PAGES'] as const,
  list: (params?: PageListParams) => [...pageKeys.all, 'list', params] as const,
  detail: (id: number) => [...pageKeys.all, 'detail', id] as const,
  revisions: (id: number) => [...pageKeys.all, 'revisions', id] as const,
  templates: () => [...pageKeys.all, 'templates'] as const,
  catalog: () => [...pageKeys.all, 'catalog'] as const,
}

export const usePagesQuery = (params: PageListParams) =>
  usePaginatedQuery({ queryKey: pageKeys.list(params), queryFn: () => pagesApi.list(params) })

export const usePageQuery = (id: number) =>
  useQuery({ queryKey: pageKeys.detail(id), queryFn: () => pagesApi.show(id), staleTime: 0 })

export const usePageRevisionsQuery = (id: number, enabled: boolean) =>
  useQuery({ queryKey: pageKeys.revisions(id), queryFn: () => pagesApi.revisions(id), enabled })

export const usePageTemplatesQuery = (enabled: boolean) =>
  useQuery({ queryKey: pageKeys.templates(), queryFn: () => pagesApi.templates(), enabled })

export const useSectionCatalogQuery = () =>
  useQuery({ queryKey: pageKeys.catalog(), queryFn: () => pagesApi.sectionCatalog(), staleTime: 5 * 60_000 })
