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
  WHOLESALE: { INDEX: 'wholesale.index', CREATE: 'wholesale.create' },
  CLASSIFIED: { INDEX: 'classified.index', CREATE: 'classified.create' },
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
  CLUB_POINT: {
    INDEX: 'club_point.index',
    PRODUCTS: 'club_point.products',
    PRODUCTS_MANAGE: 'club_point.products_manage',
    CONFIG: 'club_point.config',
    CONFIG_MANAGE: 'club_point.config_manage',
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
  POS: {
    INDEX: 'pos.index',
    ORDERS: 'pos.orders',
    PRODUCTS: 'pos.products',
    PRODUCTS_MANAGE: 'pos.products_manage',
    CONFIG: 'pos.config',
    CONFIG_MANAGE: 'pos.config_manage',
    ACTIVATION_MANAGE: 'pos.activation_manage',
  },
  COURIER: {
    INDEX: 'courier.index',
    CREATE: 'courier.create',
    EDIT: 'courier.edit',
    BAN: 'courier.ban',
    COLLECT: 'courier.collect',
    PAY: 'courier.pay',
    PAYMENTS: 'courier.payments',
    COLLECTIONS: 'courier.collections',
    CANCEL_REQUESTS: 'courier.cancel_requests',
    CONFIG: 'courier.config',
    CONFIG_MANAGE: 'courier.config_manage',
    DELIVERIES: 'courier.deliveries',
    DELIVERIES_MANAGE: 'courier.deliveries_manage',
    CASH_REPORT: 'courier.cash_report',
    EARNINGS: 'courier.earnings',
  },
  OTP: {
    INDEX: 'otp.index',
    SETTINGS_MANAGE: 'otp.settings_manage',
    GATEWAYS: 'otp.gateways',
    GATEWAYS_MANAGE: 'otp.gateways_manage',
    TEMPLATES: 'otp.templates',
    TEMPLATES_MANAGE: 'otp.templates_manage',
    BULK_SMS: 'otp.bulk_sms',
  },
  AI: {
    INDEX: 'ai.index',
    SETTINGS_MANAGE: 'ai.settings_manage',
    PROMPTS: 'ai.prompts',
    PROMPTS_MANAGE: 'ai.prompts_manage',
    USAGE: 'ai.usage',
    TRANSLATE: 'ai.translate',
  },
  PAYMENTS: {
    INDEX: 'payments.index',
    MANUAL_MANAGE: 'payments.manual_manage',
    OFFLINE_ORDERS: 'payments.offline_orders',
    WALLET_REQUESTS: 'payments.wallet_requests',
    WALLET_MANAGE: 'payments.wallet_manage',
    SELLER_PACKAGES: 'payments.seller_packages',
    SELLER_PACKAGES_MANAGE: 'payments.seller_packages_manage',
    CUSTOMER_PACKAGES: 'payments.customer_packages',
    CUSTOMER_PACKAGES_MANAGE: 'payments.customer_packages_manage',
    PAYOUT_METHODS: 'payments.payout_methods',
    PAYOUT_METHODS_MANAGE: 'payments.payout_methods_manage',
    PAYRIFF: 'payments.payriff',
    PAYRIFF_MANAGE: 'payments.payriff_manage',
  },
} as const

export const ALL_PERMISSIONS: string[] = Object.values(PERMISSIONS).flatMap(
  (group) => Object.values(group)
)
