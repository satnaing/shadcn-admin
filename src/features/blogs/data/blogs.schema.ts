import { z } from 'zod'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import type { BlogDetail, BlogCategoryDetail } from './blogs.type'

const translation = z.object({
  title: z.string(),
  short_description: z.string(),
  content: z.string(),
  slug: z.string(),
  meta_title: z.string(),
  meta_description: z.string(),
  og_image: z.string(),
})

const translations = z.object({
  az: translation,
  ru: translation,
  tr: translation,
  en: translation,
})

export const blogSchema = z
  .object({
    category_id: z.number().min(1, 'required'),
    cover: z.string(),
    tags: z.string(),
    status: z.enum(['draft', 'published', 'scheduled']),
    publish_at: z.string(),
    translations,
  })
  .superRefine((v, ctx) => {
    if (!v.translations.en.title.trim()) {
      ctx.addIssue({ code: 'custom', path: ['translations', 'en', 'title'], message: 'required' })
    }
    if (v.status === 'scheduled' && !v.publish_at) {
      ctx.addIssue({ code: 'custom', path: ['publish_at'], message: 'required' })
    }
  })

export type BlogFormValues = z.infer<typeof blogSchema>

const emptyTranslation = {
  title: '', short_description: '', content: '', slug: '', meta_title: '', meta_description: '', og_image: '',
}

export const blogDefaults: BlogFormValues = {
  category_id: 0,
  cover: '',
  tags: '',
  status: 'draft',
  publish_at: '',
  translations: { az: emptyTranslation, ru: emptyTranslation, tr: emptyTranslation, en: emptyTranslation },
}

export const blogToForm = (b: BlogDetail): BlogFormValues => ({
  category_id: b.category_id,
  cover: b.cover,
  tags: b.tags.join(', '),
  status: b.status,
  publish_at: b.publish_at ?? '',
  translations: { ...blogDefaults.translations, ...b.translations },
})

export const blogToPayload = (v: BlogFormValues) => ({
  ...v,
  tags: v.tags.split(',').map((t) => t.trim()).filter(Boolean),
  publish_at: v.status === 'scheduled' ? v.publish_at : null,
})

export const categorySchema = z.object({
  status: z.boolean(),
  translations: z.object({
    az: z.object({ name: z.string(), slug: z.string() }),
    ru: z.object({ name: z.string(), slug: z.string() }),
    tr: z.object({ name: z.string(), slug: z.string() }),
    en: z.object({ name: z.string().min(1, 'required'), slug: z.string().min(1, 'required') }),
  }),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

const emptyCat = { name: '', slug: '' }
export const categoryDefaults: CategoryFormValues = {
  status: true,
  translations: { az: emptyCat, ru: emptyCat, tr: emptyCat, en: emptyCat },
}

export const categoryToForm = (c: BlogCategoryDetail): CategoryFormValues => ({
  status: c.status,
  translations: { ...categoryDefaults.translations, ...c.translations },
})

export const BLOG_LOCALES = FALLBACK_FORM_LOCALES
