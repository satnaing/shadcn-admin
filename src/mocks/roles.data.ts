import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'

export interface MockRole {
  id: number
  name: string
  description: string
  system: boolean
  users_count: number
  permissions: string[]
  created_at: string
  updated_at: string
}

const values = (...groups: Record<string, string>[]) => groups.flatMap((g) => Object.values(g))
const readOnly = (names: string[]) => names.filter((p) => /\.(index|show)$/.test(p))
const P = PERMISSIONS

const make = (
  id: number,
  name: string,
  description: string,
  users_count: number,
  permissions: string[],
  system = false
): MockRole => ({
  id,
  name,
  description,
  system,
  users_count,
  permissions,
  created_at: `2026-0${(id % 9) + 1}-1${id % 9}T09:00:00Z`,
  updated_at: '2026-11-10T12:00:00Z',
})

export const mockRoles: MockRole[] = [
  make(1, 'admin', 'Full access to everything', 2, [...ALL_PERMISSIONS], true),
  make(2, 'editor', 'Pages and blogs', 6, [P.DASHBOARD.INDEX, ...values(P.PAGES, P.BLOGS)]),
  make(3, 'content_manager', 'Pages, blogs and menus', 3, [
    P.DASHBOARD.INDEX,
    ...values(P.PAGES, P.BLOGS),
    P.THEMES.INDEX,
    P.THEMES.MENU,
    P.THEMES.BANNERS,
  ]),
  make(4, 'blogger', 'Writes blog posts only', 9, [P.DASHBOARD.INDEX, ...values(P.BLOGS)]),
  make(5, 'designer', 'Themes, header, footer', 2, [P.DASHBOARD.INDEX, ...values(P.THEMES)]),
  make(6, 'seo_manager', 'SEO settings and page meta', 1, [
    P.DASHBOARD.INDEX,
    P.PAGES.INDEX,
    P.PAGES.UPDATE,
    P.BLOGS.INDEX,
    P.BLOGS.UPDATE,
    P.SETTINGS.INDEX,
    P.SETTINGS.SEO,
  ]),
  make(7, 'module_manager', 'Enables and updates modules', 1, [
    P.DASHBOARD.INDEX,
    ...values(P.MODULES),
  ]),
  make(8, 'support', 'Read-only access to users', 4, [
    P.DASHBOARD.INDEX,
    P.USERS.INDEX,
    P.USERS.SHOW,
    P.ROLES.INDEX,
  ]),
  make(9, 'translator', 'Languages and content translation', 5, [
    P.DASHBOARD.INDEX,
    P.PAGES.INDEX,
    P.PAGES.UPDATE,
    P.BLOGS.INDEX,
    P.BLOGS.UPDATE,
    P.SETTINGS.INDEX,
    P.SETTINGS.LANGUAGES,
  ]),
  make(10, 'viewer', 'Sees everything, changes nothing', 7, readOnly(ALL_PERMISSIONS)),
  make(11, 'pos_operator', 'POS module screens', 3, [P.DASHBOARD.INDEX, ...values(P.POS)]),
]
