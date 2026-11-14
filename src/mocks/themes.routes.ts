import { type Handler, ok } from './helpers'
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

const SETTINGS: Record<string, unknown> = {
  topbar: mockTopbar,
  header: mockHeader,
  footer: mockFooter,
  tokens: mockTokens,
  'custom-code': mockCustomCode,
}

let nextBannerId = 1000

// Writes answer 200 only: the mock adapter hands handlers no request body, so the admin caches what it saved.
const routes: Record<string, Handler> = {
  'GET /admin/themes': () => ({ data: mockThemes }),
  'GET /admin/themes/:id/compatibility': ({ params }) => ({ data: mockCompatibility[params[0]] ?? [] }),
  'POST /admin/themes/:id/activate': ({ params }) => {
    mockThemes.forEach((theme) => {
      theme.active = theme.id === params[0]
    })
    return { data: { id: params[0] } }
  },

  'GET /admin/themes/settings/:block': ({ params }) => ({
    data:
      params[0] === 'tokens' && mockThemes.find((theme) => theme.active)?.id === 'theme-senseihost'
        ? mockTokensLocked
        : (SETTINGS[params[0]] ?? null),
  }),
  'PUT /admin/themes/settings/:block': ok({ message: 'saved' }),

  'GET /admin/themes/menus': () => ({ data: mockMenus }),
  'PUT /admin/themes/menus/:location': ok({ message: 'saved' }),

  'GET /admin/themes/banners': ({ query }) => ({
    data: mockBanners.filter(
      (banner) =>
        (!query.group || banner.group === query.group) && (!query.locale || banner.locales.includes(query.locale))
    ),
  }),
  'POST /admin/themes/banners': () => ({ data: { id: nextBannerId++ } }),
  'PUT /admin/themes/banners/reorder': ok({ message: 'saved' }),
  'PUT /admin/themes/banners/:id': ok({ message: 'saved' }),
  'DELETE /admin/themes/banners/:id': ok({ message: 'deleted' }),
  'PATCH /admin/themes/banners/:id/toggle': ok({ message: 'saved' }),
  'GET /admin/themes/banner-groups/:group': ({ params }) => ({ data: mockGroupSettings[params[0]] ?? null }),
  'PUT /admin/themes/banner-groups/:group': ok({ message: 'saved' }),
}

export default routes
