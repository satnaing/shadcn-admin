export type PageStatus = 'draft' | 'published'
export type LocalizedText = Record<string, string>

/** One row of `GET /admin/pages`. `translations` = locales that already have content. */
export interface PageRow {
  id: number
  title: string
  slug: string
  status: PageStatus
  is_homepage: boolean
  translations: string[]
  sections_count: number
  updated_at: string
}

export interface PageSeo {
  title: LocalizedText
  description: LocalizedText
  canonical: string
}

export interface PageSection {
  id: string
  component: string
  hidden: boolean
  /** Localized fields hold `{ az, en, … }`; everything else is stored as-is. */
  payload: Record<string, unknown>
}

export interface PageDetail {
  id: number
  title: LocalizedText
  slug: LocalizedText
  status: PageStatus
  is_homepage: boolean
  publish_at: string | null
  header_variant: string
  footer_variant: string
  seo: PageSeo
  sections: PageSection[]
  updated_at: string
}

export interface PageSettingsPayload {
  title: LocalizedText
  slug: LocalizedText
  status: PageStatus
  is_homepage: boolean
  publish_at: string | null
  header_variant: string
  footer_variant: string
  seo: PageSeo
}

export interface PageCreatePayload {
  title: string
  slug: string
  template_id: number | null
}

export interface PageTemplate {
  id: number
  name: string
  description: string
  sections: Array<Pick<PageSection, 'component' | 'payload'>>
}

export interface PageRevision {
  id: number
  author: string
  created_at: string
  sections_count: number
  note: string
}

export interface PageListParams {
  page?: number
  per_page?: number
  q?: string
  /** `field` ascending, `-field` descending. */
  sort?: string
  status?: string
  lang?: string
}

/** Minimal JSON-Schema subset used by `payload_schema` (see docs: Q-P1). */
export type SchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'
export type SchemaFormat = 'textarea' | 'richtext' | 'image' | 'link' | 'color' | 'source'
export type FieldTab = 'content' | 'source' | 'style'

export interface SchemaNode {
  type: SchemaType
  title?: string
  format?: SchemaFormat
  enum?: string[]
  default?: unknown
  properties?: Record<string, SchemaNode>
  items?: SchemaNode
  'x-localized'?: boolean
  'x-tab'?: FieldTab
}

export interface PayloadSchema {
  type: 'object'
  properties: Record<string, SchemaNode>
}

export interface SectionCatalogItem {
  component: string
  category: string
  title: string
  theme: string
  /** Absent for the sections that have no schema yet (xshop: 40 of 62) → raw JSON editor. */
  payload_schema?: PayloadSchema
}

export const SOURCE_TYPES = ['manual', 'category', 'product', 'brand', 'deal', 'post'] as const
export type SourceType = (typeof SOURCE_TYPES)[number]
export interface SourceValue {
  type: SourceType
  ids: string
}
