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
  PREORDER: {
    INDEX: 'preorder.index',
    PRODUCTS: 'preorder.products',
    PRODUCTS_MANAGE: 'preorder.products_manage',
    ORDERS: 'preorder.orders',
    ORDERS_MANAGE: 'preorder.orders_manage',
    COMMISSIONS: 'preorder.commissions',
    CONVERSATIONS: 'preorder.conversations',
    CONVERSATIONS_MANAGE: 'preorder.conversations_manage',
    QUERIES: 'preorder.queries',
    QUERIES_MANAGE: 'preorder.queries_manage',
    REVIEWS: 'preorder.reviews',
    REVIEWS_MANAGE: 'preorder.reviews_manage',
    FAQS: 'preorder.faqs',
    FAQS_MANAGE: 'preorder.faqs_manage',
    NOTIFICATIONS: 'preorder.notifications',
    NOTIFICATIONS_MANAGE: 'preorder.notifications_manage',
    SETTINGS: 'preorder.settings',
  },
  AFFILIATE: {
    INDEX: 'affiliate.index',
    CONFIG_MANAGE: 'affiliate.config_manage',
    FORM: 'affiliate.form',
    USERS: 'affiliate.users',
    USERS_MANAGE: 'affiliate.users_manage',
    USERS_PAY: 'affiliate.users_pay',
    PAYMENTS: 'affiliate.payments',
    REFERRALS: 'affiliate.referrals',
    WITHDRAWS: 'affiliate.withdraws',
    WITHDRAWS_MANAGE: 'affiliate.withdraws_manage',
    LOGS: 'affiliate.logs',
  },
} as const

export const ALL_PERMISSIONS: string[] = Object.values(PERMISSIONS).flatMap(
  (group) => Object.values(group)
)
