import type { PageCreatePayload, PageSection, PageSettingsPayload } from '@/features/pages/data/pages.type'
import { type Handler, paginate } from './helpers'
import { senseihostCatalog, xshopCatalog } from './pages.catalog'
import { pageDetails, pageTemplates, revisionsFor, toRow } from './pages.data'

type Ctx = Parameters<Handler>[0] & { body?: unknown }

const find = (id: string) => pageDetails.find((page) => String(page.id) === id)

const routes: Record<string, (ctx: Ctx) => unknown> = {
  'GET /admin/pages': (ctx) => {
    const { status, lang } = ctx.query
    const rows = pageDetails
      .map(toRow)
      .filter((row) => !status || status === 'all' || row.status === status)
      .filter((row) => !lang || row.translations.includes(lang))
    return paginate(rows as unknown as Record<string, unknown>[])(ctx)
  },
  'GET /admin/pages/:id': ({ params }) => ({ data: find(params[0]) ?? pageDetails[0] }),
  'POST /admin/pages': ({ body }) => {
    const input = body as PageCreatePayload
    const template = pageTemplates.find((tpl) => tpl.id === input.template_id)
    const id = Math.max(0, ...pageDetails.map((page) => page.id)) + 1
    const titles = { az: input.title, en: input.title, tr: input.title, ru: input.title }
    pageDetails.unshift({
      id,
      title: titles,
      slug: { az: input.slug, en: input.slug, tr: input.slug, ru: input.slug },
      status: 'draft',
      is_homepage: false,
      publish_at: null,
      header_variant: 'default',
      footer_variant: 'default',
      seo: { title: titles, description: {}, canonical: '' },
      sections: (template?.sections ?? []).map((s, i) => ({ id: `n${id}-${i}`, hidden: false, ...s })),
      updated_at: new Date().toISOString(),
    })
    return { data: toRow(pageDetails[0]) }
  },
  'PUT /admin/pages/:id': ({ params, body }) => {
    const page = find(params[0])
    if (page) Object.assign(page, body as PageSettingsPayload, { updated_at: new Date().toISOString() })
    return { message: 'ok' }
  },
  'DELETE /admin/pages/:id': ({ params }) => {
    const at = pageDetails.findIndex((page) => String(page.id) === params[0])
    if (at >= 0 && !pageDetails[at].is_homepage) pageDetails.splice(at, 1)
    return { message: 'ok' }
  },
  'PATCH /admin/pages/:id/draft': ({ params, body }) => {
    const page = find(params[0])
    if (page) page.sections = (body as { sections: PageSection[] }).sections
    return { data: { saved_at: new Date().toISOString() } }
  },
  'POST /admin/pages/:id/publish': ({ params }) => {
    const page = find(params[0])
    if (page) page.status = 'published'
    return { message: 'ok' }
  },
  'GET /admin/pages/:id/revisions': ({ params }) => ({ data: revisionsFor(Number(params[0])) }),
  // shortcut: revisions carry only a section count, so restore trims to it; real API restores the snapshot
  'POST /admin/pages/:id/revisions/:rev/restore': ({ params }) => {
    const page = find(params[0])
    const revision = revisionsFor(Number(params[0])).find((r) => String(r.id) === params[1])
    if (page && revision) {
      page.sections = page.sections.slice(0, revision.sections_count)
      page.updated_at = new Date().toISOString()
    }
    return { message: 'ok' }
  },
  'POST /admin/pages/:id/preview-token': ({ params }) => ({
    data: { token: `mock-${params[0]}`, url: `about:blank#preview-${params[0]}` },
  }),
  'GET /admin/page-templates': () => ({ data: pageTemplates }),
  'GET /admin/themes/active/sections': ({ query }) => ({
    data: query.theme === 'theme-senseihost' ? senseihostCatalog : xshopCatalog,
  }),
}

export default routes as Record<string, Handler>
