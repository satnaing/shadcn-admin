import type { Banner, BannerDraft, BannerGroupSettings, MenuNode } from '@/features/themes/data/themes.type'
import { createCollection, type Handler } from './helpers'
import {
  mockBanners,
  mockCompatibility,
  mockCustomCode,
  mockFooter,
  mockGroupSettings,
  mockHeader,
  mockMenus,
  mockThemes,
  mockTokens,
  mockTokensLocked,
  mockTopbar,
} from './themes.data'

const isSensei = () => mockThemes.find((theme) => theme.active)?.id === 'theme-senseihost'
const settingsOf = (block: string): Record<string, unknown> | undefined =>
  (block === 'tokens' && isSensei()
    ? mockTokensLocked
    : ({ topbar: mockTopbar, header: mockHeader, footer: mockFooter, tokens: mockTokens, 'custom-code': mockCustomCode } as Record<string, unknown>)[block]) as Record<string, unknown> | undefined

const banners = createCollection<Banner>(mockBanners)
const sorted = () => [...banners.all()].sort((a, b) => a.order - b.order)
const nextOrder = (group: string) => Math.max(0, ...banners.all().filter((b) => b.group === group).map((b) => b.order)) + 1

const routes: Record<string, Handler> = {
  'GET /admin/themes': () => ({ data: mockThemes }),
  'GET /admin/themes/:id/compatibility': ({ params }) => ({ data: mockCompatibility[params[0]] ?? [] }),
  'POST /admin/themes/:id/activate': ({ params }) => {
    mockThemes.forEach((theme) => {
      theme.active = theme.id === params[0]
    })
    return { data: { id: params[0] } }
  },

  'GET /admin/themes/settings/:block': ({ params }) => ({ data: settingsOf(params[0]) ?? null }),
  'PUT /admin/themes/settings/:block': ({ params, body }) => {
    const target = settingsOf(params[0])
    if (target) Object.assign(target, body as object)
    return { data: target ?? null, message: 'saved' }
  },

  'GET /admin/themes/menus': () => ({ data: mockMenus }),
  'PUT /admin/themes/menus/:location': ({ params, body }) => {
    const menu = mockMenus.find((m) => m.location === params[0])
    if (menu) menu.items = (body as { items: MenuNode[] }).items
    return { data: menu ?? null, message: 'saved' }
  },

  'GET /admin/themes/banners': ({ query }) => ({
    data: sorted().filter(
      (banner) =>
        (!query.group || banner.group === query.group) && (!query.locale || banner.locales.includes(query.locale))
    ),
  }),
  'POST /admin/themes/banners': ({ body }) => {
    const draft = body as BannerDraft
    return { data: banners.create({ ...draft, order: nextOrder(draft.group) } as Omit<Banner, 'id'>) }
  },
  'PUT /admin/themes/banners/reorder': ({ body }) => {
    const ids = (body as { ids: number[] }).ids
    ids.forEach((id, index) => banners.update(id, { order: index + 1 }))
    return { message: 'saved' }
  },
  'PUT /admin/themes/banners/:id': ({ params, body }) => ({
    data: banners.update(params[0], body as Partial<Banner>),
  }),
  'DELETE /admin/themes/banners/:id': ({ params }) => {
    banners.remove(params[0])
    return { message: 'deleted' }
  },
  'PATCH /admin/themes/banners/:id/toggle': ({ params }) => {
    const banner = banners.get(params[0])
    return { data: banner && banners.update(params[0], { enabled: !banner.enabled }) }
  },
  'GET /admin/themes/banner-groups/:group': ({ params }) => ({ data: mockGroupSettings[params[0]] ?? null }),
  'PUT /admin/themes/banner-groups/:group': ({ params, body }) => {
    mockGroupSettings[params[0]] = body as BannerGroupSettings
    return { data: mockGroupSettings[params[0]] }
  },
}

export default routes
