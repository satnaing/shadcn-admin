import type { Locale } from '@/shared/types'

export type BlogStatus = 'draft' | 'published' | 'scheduled'

export interface BlogTranslation {
  title: string
  short_description: string
  content: string
  slug: string
  meta_title: string
  meta_description: string
  og_image: string
}

export interface BlogListItem {
  id: number
  title: string
  slug: string
  cover: string
  category_id: number
  category_name: string
  /** Locales whose translation has a title. */
  locales: Locale[]
  status: BlogStatus
  publish_at: string | null
  views: number
  updated_at: string
}

export interface BlogDetail {
  id: number
  category_id: number
  cover: string
  tags: string[]
  status: BlogStatus
  publish_at: string | null
  translations: Record<Locale, BlogTranslation>
}

export interface BlogCategoryTranslation {
  name: string
  slug: string
}

export interface BlogCategoryListItem {
  id: number
  name: string
  slug: string
  posts_count: number
  status: boolean
}

export interface BlogCategoryDetail {
  id: number
  status: boolean
  translations: Record<Locale, BlogCategoryTranslation>
}

export interface BlogListParams {
  page?: number
  pageSize?: number
  sort?: string
  order?: string
  filter?: string
  status?: string
  category?: string
}
