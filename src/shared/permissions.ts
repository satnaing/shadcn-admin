/**
 * The ONE permission tree. The API seeder must return exactly these names.
 * Ownership ("own rows only") is an API policy, never a separate `*_own` key.
 * A feature section appends its group here — nothing else.
 */
const crud = (m: string) =>
  ({
    INDEX: `${m}.index`,
    SHOW: `${m}.show`,
    CREATE: `${m}.create`,
    UPDATE: `${m}.update`,
    DELETE: `${m}.delete`,
  }) as const

export const PERMISSIONS = {
  DASHBOARD: { INDEX: 'dashboard.index' },

  PAGES: {
    ...crud('pages'),
    PUBLISH: 'pages.publish',
    BUILDER: 'pages.builder',
  },

  BLOGS: {
    ...crud('blogs'),
    PUBLISH: 'blogs.publish',
    CATEGORIES: 'blogs.categories',
  },

  THEMES: {
    INDEX: 'themes.index',
    ACTIVATE: 'themes.activate',
    TOPBAR: 'themes.topbar',
    HEADER: 'themes.header',
    MENU: 'themes.menu',
    FOOTER: 'themes.footer',
    BANNERS: 'themes.banners',
    TOKENS: 'themes.tokens',
    CUSTOM_CODE: 'themes.custom_code',
  },

  MODULES: {
    INDEX: 'modules.index',
    TOGGLE: 'modules.toggle',
    INSTALL: 'modules.install',
    UPDATE: 'modules.update',
    DELETE: 'modules.delete',
  },

  SETTINGS: {
    INDEX: 'settings.index',
    GENERAL: 'settings.general',
    LANGUAGES: 'settings.languages',
    SEO: 'settings.seo',
    CURRENCY: 'settings.currency',
    EMAIL: 'settings.email',
    NOTIFICATIONS: 'settings.notifications',
  },

  USERS: { ...crud('users') },
  ROLES: { ...crud('roles') },
  PERMISSIONS: { INDEX: 'permissions.index', UPDATE: 'permissions.update' },

  // Module-declared screens (mock modules); real modules append their own group.
  POS: { INDEX: 'pos.index', ORDERS: 'pos.orders', PRODUCTS: 'pos.products' },
  WHOLESALE: { INDEX: 'wholesale.index', CREATE: 'wholesale.create' },
  CLASSIFIED: { INDEX: 'classified.index', CREATE: 'classified.create' },
  DELIVERY_BOYS: { INDEX: 'delivery_boys.index', COLLECTIONS: 'delivery_boys.collections' },
  QRCODE_EVENT: {
    INDEX: 'qrcode_event.index',
    SETTINGS: 'qrcode_event.settings',
    CAMPAIGNS: 'qrcode_event.campaigns',
    CAMPAIGNS_MANAGE: 'qrcode_event.campaigns_manage',
    BATCHES: 'qrcode_event.batches',
    BATCHES_CREATE: 'qrcode_event.batches_create',
    CODES: 'qrcode_event.codes',
    CODES_MANAGE: 'qrcode_event.codes_manage',
    LOGS: 'qrcode_event.logs',
  },
  REFUND: {
    INDEX: 'refund.index',
    REQUESTS_MANAGE: 'refund.requests_manage',
    DISPUTES: 'refund.disputes',
    DISPUTES_MANAGE: 'refund.disputes_manage',
    REASONS: 'refund.reasons',
    REASONS_MANAGE: 'refund.reasons_manage',
    CATEGORIES: 'refund.categories',
    SETTINGS: 'refund.settings',
  },
} as const

export const ALL_PERMISSIONS: string[] = Object.values(PERMISSIONS).flatMap(
  (group) => Object.values(group)
)
