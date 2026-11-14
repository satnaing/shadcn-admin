import { createCollection, type Handler, paginate } from './helpers'

type Loc = 'az' | 'ru' | 'tr' | 'en'
type Status = 'draft' | 'published' | 'scheduled'

const CATEGORIES = [
  { id: 1, en: 'News', az: 'Xəbərlər', ru: 'Новости', tr: 'Haberler', status: true },
  { id: 2, en: 'Guides', az: 'Bələdçilər', ru: 'Руководства', tr: 'Rehberler', status: true },
  { id: 3, en: 'Product updates', az: 'Məhsul yenilikləri', ru: 'Обновления', tr: 'Ürün güncellemeleri', status: true },
  { id: 4, en: 'Hosting', az: 'Hostinq', ru: 'Хостинг', tr: 'Hosting', status: true },
  { id: 5, en: 'E-commerce', az: 'E-ticarət', ru: 'Эл. коммерция', tr: 'E-ticaret', status: true },
  { id: 6, en: 'Archive', az: 'Arxiv', ru: 'Архив', tr: 'Arşiv', status: false },
]

const TOPICS = [
  'Launching your first online store', 'How to pick a domain name', 'Speeding up a storefront',
  'SEO checklist for product pages', 'Understanding wholesale pricing', 'Running a flash sale',
  'Managing courier deliveries', 'Setting up POS in a shop', 'What is a mega menu', 'Theme colors that convert',
  'Multi-language storefronts', 'Weekly release notes', 'Handling refunds smoothly', 'Seller onboarding tips',
  'Email templates that work', 'Cart abandonment recovery', 'Choosing a hosting plan', 'Backup strategies',
  'Security basics for admins', 'Using banners and sliders', 'Blog writing for SEO', 'Customer support macros',
  'Inventory forecasting', 'Year in review',
]

const STATUSES: Status[] = ['published', 'published', 'draft', 'scheduled']
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const catName = (id: number) => CATEGORIES.find((c) => c.id === id)?.en ?? ''

const blogs = TOPICS.map((title, i) => {
  const id = i + 1
  const status = STATUSES[i % STATUSES.length]
  const locales: Loc[] = i % 3 === 0 ? ['az', 'ru', 'tr', 'en'] : i % 3 === 1 ? ['az', 'en'] : ['en']
  return {
    id, title, slug: slug(title), cover: `https://picsum.photos/seed/blog${id}/160/100`,
    category_id: (i % 5) + 1, category_name: catName((i % 5) + 1), locales, status,
    publish_at: status === 'scheduled' ? '2026-12-01T09:00' : null,
    views: 120 * id, updated_at: `2026-11-${String((i % 28) + 1).padStart(2, '0')}`,
  }
})

type Trans = Record<Loc, { title: string; short_description: string; content: string; slug: string; meta_title: string; meta_description: string; og_image: string }>
type BlogRow = (typeof blogs)[number] & { tags?: string[]; translations?: Trans }
type BlogBody = { category_id: number; cover: string; tags: string[]; status: Status; publish_at: string | null; translations: Trans }
type CatBody = { status: boolean; translations: Record<Loc, { name: string; slug: string }> }

const blogCol = createCollection<BlogRow>(blogs)
const catCol = createCollection(CATEGORIES)
const now = () => new Date().toISOString().slice(0, 10)

const toRow = (b: BlogBody) => {
  const locales = (Object.keys(b.translations) as Loc[]).filter((l) => b.translations[l].title.trim())
  const en = b.translations.en
  return {
    title: en.title, slug: en.slug || slug(en.title), cover: b.cover, category_id: b.category_id,
    category_name: catName(b.category_id), locales, status: b.status, publish_at: b.publish_at,
    tags: b.tags, translations: b.translations, updated_at: now(),
  }
}

const detail = (id: string): unknown => {
  const b = blogCol.get(id) ?? blogCol.all()[0]
  const t = (l: Loc) => ({
    title: b.locales.includes(l) ? (l === 'en' ? b.title : `${b.title} (${l})`) : '',
    short_description: b.locales.includes(l) ? `Short summary of "${b.title}".` : '',
    content: b.locales.includes(l) ? `<p>${b.title}. Lorem ipsum dolor sit amet.</p>` : '',
    slug: b.slug, meta_title: '', meta_description: '', og_image: '',
  })
  return {
    data: {
      id: b.id, category_id: b.category_id, cover: b.cover, tags: b.tags ?? ['store', 'guide'],
      status: b.status, publish_at: b.publish_at,
      translations: b.translations ?? { az: t('az'), ru: t('ru'), tr: t('tr'), en: t('en') },
    },
  }
}

const listBlogs: Handler = (ctx) => {
  const { status, category } = ctx.query
  const rows = blogCol.all().filter(
    (b) => (!status || b.status === status) && (!category || String(b.category_id) === category)
  )
  return paginate(rows)(ctx)
}

const categoryRows = () =>
  catCol.all().map((c) => ({
    id: c.id, name: c.en, slug: slug(c.en), status: c.status,
    posts_count: blogCol.all().filter((b) => b.category_id === c.id).length,
  }))

const fromCatBody = (b: CatBody) => ({
  en: b.translations.en.name, az: b.translations.az.name || b.translations.en.name,
  ru: b.translations.ru.name || b.translations.en.name, tr: b.translations.tr.name || b.translations.en.name,
  status: b.status,
})

const routes: Record<string, Handler> = {
  'GET /admin/blogs': listBlogs,
  'GET /admin/blogs/:id': ({ params }) => detail(params[0]),
  'POST /admin/blogs': ({ body }) => ({
    data: blogCol.create({ ...toRow(body as BlogBody), views: 0 } as Omit<BlogRow, 'id'>, 'start'),
    message: 'created',
  }),
  'PUT /admin/blogs/:id': ({ params, body }) => {
    blogCol.update(params[0], toRow(body as BlogBody) as Partial<BlogRow>)
    return { message: 'updated' }
  },
  'DELETE /admin/blogs/:id': ({ params }) => {
    blogCol.remove(params[0])
    return { message: 'deleted' }
  },
  'GET /admin/blog-categories': (ctx) =>
    paginate(categoryRows)({ ...ctx, query: { sort: 'id', ...ctx.query } }),
  'GET /admin/blog-categories/:id': ({ params }) => {
    const c = catCol.get(params[0]) ?? catCol.all()[0]
    const tr = (l: Loc) => ({ name: c[l], slug: slug(c.en) })
    return {
      data: { id: c.id, status: c.status, translations: { az: tr('az'), ru: tr('ru'), tr: tr('tr'), en: tr('en') } },
    }
  },
  'POST /admin/blog-categories': ({ body }) => ({
    data: catCol.create(fromCatBody(body as CatBody)),
    message: 'created',
  }),
  'PUT /admin/blog-categories/:id': ({ params, body }) => {
    catCol.update(params[0], fromCatBody(body as CatBody))
    return { message: 'updated' }
  },
  'DELETE /admin/blog-categories/:id': ({ params }) => {
    catCol.remove(params[0])
    return { message: 'deleted' }
  },
}

export default routes
