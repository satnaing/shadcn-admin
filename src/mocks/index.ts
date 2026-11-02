import { authMock } from './auth'
import {
  attributesMock,
  brandsMock,
  categoriesMock,
  colorsMock,
  unitsMock,
} from './catalog'
import { classifiedProductsMock } from './classified'
import {
  customerPackagesMock,
  customersMock,
} from './customers'
import {
  categoryDiscountsMock,
  couponsMock,
  flashDealsMock,
  promotionalProductsMock,
} from './promotions'
import {
  mockAlerts,
  mockBlogCategories,
  mockBlogs,
  mockEmailTemplates,
  mockMarketingSummary,
  mockNewsletters,
  mockNotificationHistory,
  mockNotificationSettings,
  mockNotificationTypes,
  mockPopups,
  mockSaleAlerts,
  mockSubscribers,
  mockVisitorSettings,
} from './marketing'
import {
  mockAnalyticsOverview,
  mockCapiConfig,
  mockCustomScriptsConfig,
  mockFbCatalogConfig,
  mockGa4Config,
  mockGa4Reports,
  mockGlobalSeoConfig,
  mockGmcConfig,
  mockGtmConfig,
  mockMetaPixelConfig,
  mockSitemapConfig,
} from './analytics'
import {
  commissionsMock,
  payoutRequestsMock,
  sellerPackagesMock,
  sellersMock,
  verificationFieldsMock,
} from './sellers'
import { dashboardMock } from './dashboard'
import { ordersMock } from './orders'
import { permissionsMatrixMock, rolesMock } from './roles'
import { productReviewsMock, productsMock } from './products'
import { settingsMock } from './settings'
import { staffMock } from './staff'

type Query = Record<string, string>
type Handler = (ctx: { params: string[]; query: Query }) => unknown

const PER_PAGE = 10

/** Server tərəfi səhifələmə/sıralama/axtarışı fixture üzərində təkrarlayır. */
export function paginate<T extends Record<string, unknown>>(rows: T[]): Handler {
  return ({ query }) => {
    const page = Number(query.page ?? 1)
    const perPage = Number(query.per_page ?? PER_PAGE)
    const search = (query.search ?? '').toLowerCase()
    const sort = query.sort ?? 'id'
    const order = query.order ?? 'desc'

    let data = search
      ? rows.filter((row) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(search)
          )
        )
      : rows

    data = [...data].sort((a, b) => {
      const left = String(a[sort] ?? '')
      const right = String(b[sort] ?? '')
      return order === 'asc' ? left.localeCompare(right) : right.localeCompare(left)
    })

    const total = data.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const from = (page - 1) * perPage

    return {
      data: data.slice(from, from + perPage),
      links: { first: '', last: '', prev: '', next: '' },
      meta: {
        current_page: page,
        from: from + 1,
        last_page: lastPage,
        links: [],
        path: '',
        per_page: perPage,
        to: Math.min(from + perPage, total),
        total,
      },
    }
  }
}

export function single<T extends { id: number }>(rows: T[]): Handler {
  return ({ params }) => ({
    data: rows.find((row) => String(row.id) === params[0]) ?? rows[0],
  })
}

export function ok(payload: unknown = { message: 'ok' }): Handler {
  return () => payload
}

/**
 * `METHOD /yol` → cavab. `:param` bir seqmenti tutur.
 * Hər bölüm öz sətirlərini bura əlavə edir (bax: SECTION-PROMPT.md §3.4).
 */
export const mockRoutes: Record<string, Handler> = {
  'POST /auth/login': ok(authMock),
  'POST /auth/logout': ok(),
  'GET /me': ok({
    data: {
      ...authMock.user,
      roles: [{ id: 1, name: 'admin' }],
      permissions: authMock.permissions,
    },
  }),
  'GET /auth/me': ok({
    data: {
      ...authMock.user,
      roles: [{ id: 1, name: 'admin' }],
      permissions: authMock.permissions,
    },
  }),
  'GET /settings/public': ok({ data: settingsMock }),

  // Staff endpoints
  'GET /admin/staff': paginate(staffMock.filter((s) => !s.seller_id)),
  'GET /admin/staff/:id': single(staffMock),
  'POST /admin/staff': ok({ message: 'created' }),
  'PUT /admin/staff/:id': ok({ message: 'updated' }),
  'DELETE /admin/staff/:id': ok({ message: 'deleted' }),

  'GET /seller/staff': paginate(staffMock.filter((s) => s.seller_id !== null)),
  'GET /seller/staff/:id': single(staffMock),
  'POST /seller/staff': ok({ message: 'created' }),
  'PUT /seller/staff/:id': ok({ message: 'updated' }),
  'DELETE /seller/staff/:id': ok({ message: 'deleted' }),

  // Roles & permissions endpoints
  'GET /admin/roles': paginate(rolesMock),
  'GET /admin/roles/:id': single(rolesMock),
  'POST /admin/roles': ok({ message: 'created' }),
  'PUT /admin/roles/:id': ok({ message: 'updated' }),
  'DELETE /admin/roles/:id': ok({ message: 'deleted' }),

  'GET /seller/roles': paginate(rolesMock.filter((r) => r.scope === 'seller')),
  'GET /permissions': ok({ data: permissionsMatrixMock }),

  // Dashboard endpoint
  'GET /admin/dashboard/stats': ok({ data: dashboardMock }),

  // Catalog endpoints
  'GET /admin/categories': paginate(categoriesMock),
  'GET /admin/categories/all': ok({ data: categoriesMock }),
  'GET /admin/categories/:id': single(categoriesMock),
  'POST /admin/categories': ok({ message: 'created' }),
  'PUT /admin/categories/:id': ok({ message: 'updated' }),
  'DELETE /admin/categories/:id': ok({ message: 'deleted' }),

  'GET /admin/brands': paginate(brandsMock),
  'GET /admin/brands/:id': single(brandsMock),
  'POST /admin/brands': ok({ message: 'created' }),
  'PUT /admin/brands/:id': ok({ message: 'updated' }),
  'DELETE /admin/brands/:id': ok({ message: 'deleted' }),

  'GET /admin/colors': paginate(colorsMock),
  'GET /admin/colors/:id': single(colorsMock),
  'POST /admin/colors': ok({ message: 'created' }),
  'PUT /admin/colors/:id': ok({ message: 'updated' }),
  'DELETE /admin/colors/:id': ok({ message: 'deleted' }),

  'GET /admin/attributes': paginate(attributesMock),
  'GET /admin/attributes/:id': single(attributesMock),
  'POST /admin/attributes': ok({ message: 'created' }),
  'PUT /admin/attributes/:id': ok({ message: 'updated' }),
  'DELETE /admin/attributes/:id': ok({ message: 'deleted' }),

  'GET /admin/units': paginate(unitsMock),
  'GET /admin/units/:id': single(unitsMock),
  'POST /admin/units': ok({ message: 'created' }),
  'PUT /admin/units/:id': ok({ message: 'updated' }),
  'DELETE /admin/units/:id': ok({ message: 'deleted' }),

  // Products endpoints
  'GET /admin/products': paginate(productsMock),
  'GET /admin/products/:id': single(productsMock),
  'POST /admin/products': ok({ message: 'created' }),
  'PUT /admin/products/:id': ok({ message: 'updated' }),
  'PATCH /admin/products/:id/status': ok({ message: 'status updated' }),
  'DELETE /admin/products/:id': ok({ message: 'deleted' }),

  // Product reviews
  'GET /admin/products/reviews': paginate(productReviewsMock),
  'PATCH /admin/products/reviews/:id/status': ok({ message: 'review status updated' }),
  'DELETE /admin/products/reviews/:id': ok({ message: 'deleted' }),

  // Orders endpoints
  'GET /admin/orders': ({ query }) => {
    let rows = [...ordersMock]
    if (query.search) {
      const s = query.search.toLowerCase()
      rows = rows.filter(
        (o) =>
          o.code.toLowerCase().includes(s) ||
          o.customer_name.toLowerCase().includes(s) ||
          o.customer_phone.toLowerCase().includes(s)
      )
    }
    if (query.delivery_status && query.delivery_status !== 'all') {
      rows = rows.filter((o) => o.delivery_status === query.delivery_status)
    }
    if (query.payment_status && query.payment_status !== 'all') {
      rows = rows.filter((o) => o.payment_status === query.payment_status)
    }
    if (query.seller_id) {
      if (query.seller_id === 'in_house') {
        rows = rows.filter((o) => o.seller_id === null)
      } else if (query.seller_id === 'seller') {
        rows = rows.filter((o) => o.seller_id !== null)
      } else if (query.seller_id !== 'all') {
        rows = rows.filter((o) => String(o.seller_id) === query.seller_id)
      }
    }
    if (query.shipping_type && query.shipping_type !== 'all') {
      rows = rows.filter((o) => o.shipping_type === query.shipping_type)
    }
    const page = Number(query.page ?? 1)
    const perPage = Number(query.per_page ?? PER_PAGE)
    const total = rows.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const from = (page - 1) * perPage

    return {
      data: rows.slice(from, from + perPage),
      links: { first: '', last: '', prev: '', next: '' },
      meta: {
        current_page: page,
        from: from + 1,
        last_page: lastPage,
        links: [],
        path: '',
        per_page: perPage,
        to: Math.min(from + perPage, total),
        total,
      },
    }
  },
  'GET /admin/orders/:id': single(ordersMock),
  'PATCH /admin/orders/:id/delivery-status': ok({ message: 'delivery status updated' }),
  'PATCH /admin/orders/:id/payment-status': ok({ message: 'payment status updated' }),
  'DELETE /admin/orders/:id': ok({ message: 'order deleted' }),

  // Customers endpoints
  'GET /admin/customers': ({ query }) => {
    let rows = [...customersMock]
    if (query.search) {
      const s = query.search.toLowerCase()
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.phone.toLowerCase().includes(s)
      )
    }
    if (query.is_verified && query.is_verified !== 'all') {
      const v = query.is_verified === 'true'
      rows = rows.filter((c) => c.is_verified === v)
    }
    if (query.is_banned && query.is_banned !== 'all') {
      const b = query.is_banned === 'true'
      rows = rows.filter((c) => c.is_banned === b)
    }

    const page = Number(query.page ?? 1)
    const perPage = Number(query.per_page ?? PER_PAGE)
    const total = rows.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const from = (page - 1) * perPage

    return {
      data: rows.slice(from, from + perPage),
      links: { first: '', last: '', prev: '', next: '' },
      meta: {
        current_page: page,
        from: from + 1,
        last_page: lastPage,
        links: [],
        path: '',
        per_page: perPage,
        to: Math.min(from + perPage, total),
        total,
      },
    }
  },

  // Classified Products
  'GET /admin/classified-products': ({ query }) => {
    let rows = [...classifiedProductsMock]
    if (query.creator_type && query.creator_type !== 'all') {
      rows = rows.filter((r) => r.creator_type === query.creator_type)
    }
    if (query.condition && query.condition !== 'all') {
      rows = rows.filter((r) => r.condition === query.condition)
    }
    return paginate(rows as unknown as Record<string, unknown>[])({ query, params: [] })
  },
  'GET /admin/classified-products/:id': single(classifiedProductsMock as unknown as { id: number }[]),
  'POST /admin/classified-products': ok({ message: 'created' }),
  'PUT /admin/classified-products/:id': ok({ message: 'updated' }),
  'PATCH /admin/classified-products/:id/status': ok({ message: 'status updated' }),
  'DELETE /admin/classified-products/:id': ok({ message: 'deleted' }),

  'GET /admin/customers/classified-products': ({ query }) => {
    let rows = [...classifiedProductsMock]
    if (query.creator_type && query.creator_type !== 'all') {
      rows = rows.filter((r) => r.creator_type === query.creator_type)
    }
    if (query.condition && query.condition !== 'all') {
      rows = rows.filter((r) => r.condition === query.condition)
    }
    return paginate(rows as unknown as Record<string, unknown>[])({ query, params: [] })
  },
  'POST /admin/customers/classified-products': ok({ message: 'created' }),
  'PATCH /admin/customers/classified-products/:id/status': ok({ message: 'status updated' }),
  'DELETE /admin/customers/classified-products/:id': ok({ message: 'deleted' }),

  // Customer Packages
  'GET /admin/customers/packages': ok({ data: customerPackagesMock }),
  'POST /admin/customers/packages': ok({ message: 'package created' }),
  'PUT /admin/customers/packages/:id': ok({ message: 'package updated' }),
  'DELETE /admin/customers/packages/:id': ok({ message: 'package deleted' }),

  'GET /admin/customers/:id': single(customersMock),
  'PATCH /admin/customers/:id/ban': ok({ message: 'ban status updated' }),
  'DELETE /admin/customers/:id': ok({ message: 'customer deleted' }),

  // Sellers
  'GET /admin/sellers': ({ query }) => {
    let rows = [...sellersMock]
    if (query.is_approved !== undefined && query.is_approved !== 'all') {
      const val = query.is_approved === 'true'
      rows = rows.filter((r) => r.is_approved === val)
    }
    if (query.is_verified !== undefined && query.is_verified !== 'all') {
      const val = query.is_verified === 'true'
      rows = rows.filter((r) => r.is_verified === val)
    }
    if (query.is_banned !== undefined && query.is_banned !== 'all') {
      const val = query.is_banned === 'true'
      rows = rows.filter((r) => r.is_banned === val)
    }
    return paginate(rows as unknown as Record<string, unknown>[])({ query, params: [] })
  },
  'GET /admin/sellers/payout-requests': ({ query }) => {
    let rows = [...payoutRequestsMock]
    if (query.status && query.status !== 'all') {
      rows = rows.filter((r) => r.status === query.status)
    }
    return paginate(rows as unknown as Record<string, unknown>[])({ query, params: [] })
  },
  'PATCH /admin/sellers/payout-requests/:id/status': ok({ message: 'payout status updated' }),
  'GET /admin/sellers/commissions': ok({ data: commissionsMock }),
  'POST /admin/sellers/commissions': ok({ message: 'commission rule created' }),
  'PUT /admin/sellers/commissions/:id': ok({ message: 'commission rule updated' }),
  'DELETE /admin/sellers/commissions/:id': ok({ message: 'commission rule deleted' }),
  'GET /admin/sellers/packages': ok({ data: sellerPackagesMock }),
  'POST /admin/sellers/packages': ok({ message: 'seller package created' }),
  'PUT /admin/sellers/packages/:id': ok({ message: 'seller package updated' }),
  'DELETE /admin/sellers/packages/:id': ok({ message: 'seller package deleted' }),
  'GET /admin/sellers/verification-form': ok({ data: verificationFieldsMock }),
  'POST /admin/sellers/verification-form': ok({ message: 'verification form saved' }),
  'GET /admin/sellers/:id': single(sellersMock),
  'PATCH /admin/sellers/:id/approval': ok({ message: 'approval status updated' }),
  'PATCH /admin/sellers/:id/ban': ok({ message: 'ban status updated' }),
  'POST /admin/sellers/:id/pay': ok({ message: 'payment recorded' }),

  // Promotions & Offers
  'GET /admin/promotions/flash-deals': paginate(flashDealsMock as unknown as Record<string, unknown>[]),
  'PATCH /admin/promotions/flash-deals/:id/status': ok({ message: 'status updated' }),
  'PATCH /admin/promotions/flash-deals/:id/featured': ok({ message: 'featured updated' }),
  'POST /admin/promotions/flash-deals': ok({ message: 'flash deal created' }),
  'PUT /admin/promotions/flash-deals/:id': ok({ message: 'flash deal updated' }),
  'DELETE /admin/promotions/flash-deals/:id': ok({ message: 'flash deal deleted' }),

  'GET /admin/promotions/coupons': ({ query }) => {
    let rows = [...couponsMock]
    if (query.type && query.type !== 'all') {
      rows = rows.filter((c) => c.type === query.type)
    }
    return paginate(rows as unknown as Record<string, unknown>[])({ query, params: [] })
  },
  'POST /admin/promotions/coupons': ok({ message: 'coupon created' }),
  'PUT /admin/promotions/coupons/:id': ok({ message: 'coupon updated' }),
  'PATCH /admin/promotions/coupons/:id/status': ok({ message: 'status updated' }),
  'DELETE /admin/promotions/coupons/:id': ok({ message: 'coupon deleted' }),

  'GET /admin/promotions/category-discounts': ok({ data: categoryDiscountsMock }),
  'POST /admin/promotions/category-discounts': ok({ message: 'category discount created' }),
  'DELETE /admin/promotions/category-discounts/:id': ok({ message: 'category discount deleted' }),

  'GET /admin/promotions/products': ({ query }) => {
    let rows = [...promotionalProductsMock]
    if (query.added_by && query.added_by !== 'all') {
      rows = rows.filter((p) => p.added_by === query.added_by)
    }
    return paginate(rows as unknown as Record<string, unknown>[])({ query, params: [] })
  },

  // Marketing
  'GET /admin/marketing/summary': ok(mockMarketingSummary),
  'GET /admin/marketing/popups': ok(mockPopups),
  'POST /admin/marketing/popups': ok({ message: 'popup created' }),
  'PUT /admin/marketing/popups/:id': ok({ message: 'popup updated' }),
  'DELETE /admin/marketing/popups/:id': ok({ message: 'popup deleted' }),

  'GET /admin/marketing/alerts': ok(mockAlerts),
  'POST /admin/marketing/alerts': ok({ message: 'alert created' }),
  'PUT /admin/marketing/alerts/:id': ok({ message: 'alert updated' }),
  'DELETE /admin/marketing/alerts/:id': ok({ message: 'alert deleted' }),

  'GET /admin/marketing/sale-alerts': ok(mockSaleAlerts),
  'POST /admin/marketing/sale-alerts': ok({ message: 'sale alert created' }),
  'PUT /admin/marketing/sale-alerts/:id': ok({ message: 'sale alert updated' }),
  'DELETE /admin/marketing/sale-alerts/:id': ok({ message: 'sale alert deleted' }),

  'GET /admin/marketing/email-templates': ok(mockEmailTemplates),
  'PUT /admin/marketing/email-templates/:id': ok({ message: 'email template updated' }),

  'GET /admin/marketing/blogs': ok(mockBlogs),
  'POST /admin/marketing/blogs': ok({ message: 'blog created' }),
  'PUT /admin/marketing/blogs/:id': ok({ message: 'blog updated' }),
  'DELETE /admin/marketing/blogs/:id': ok({ message: 'blog deleted' }),

  'GET /admin/marketing/blog-categories': ok(mockBlogCategories),
  'POST /admin/marketing/blog-categories': ok({ message: 'blog category created' }),
  'PUT /admin/marketing/blog-categories/:id': ok({ message: 'blog category updated' }),
  'DELETE /admin/marketing/blog-categories/:id': ok({ message: 'blog category deleted' }),

  'GET /admin/marketing/newsletters': ok(mockNewsletters),
  'POST /admin/marketing/newsletters': ok({ message: 'newsletter sent' }),

  'GET /admin/marketing/notifications/types': ok(mockNotificationTypes),
  'PUT /admin/marketing/notifications/types/:id': ok({ message: 'notification type updated' }),
  'GET /admin/marketing/notifications/history': ok(mockNotificationHistory),
  'POST /admin/marketing/notifications/send': ok({ message: 'notification sent' }),
  'GET /admin/marketing/notifications/settings': ok(mockNotificationSettings),
  'POST /admin/marketing/notifications/settings': ok({ message: 'notification settings saved' }),

  'GET /admin/marketing/subscribers': ok(mockSubscribers),
  'DELETE /admin/marketing/subscribers/:id': ok({ message: 'subscriber deleted' }),
  'POST /admin/marketing/sms/send': ok({ message: 'sms sent' }),
  'GET /admin/marketing/visitors': ok(mockVisitorSettings),
  'POST /admin/marketing/visitors': ok({ message: 'visitor settings saved' }),

  // Analytics
  'GET /admin/analytics/overview': ok(mockAnalyticsOverview),
  'GET /admin/analytics/google': ok(mockGa4Config),
  'POST /admin/analytics/google': ok({ message: 'ga4 saved' }),
  'GET /admin/analytics/google-reports': ok(mockGa4Reports),
  'GET /admin/analytics/gtm': ok(mockGtmConfig),
  'POST /admin/analytics/gtm': ok({ message: 'gtm saved' }),
  'GET /admin/analytics/pixel': ok(mockMetaPixelConfig),
  'POST /admin/analytics/pixel': ok({ message: 'pixel saved' }),
  'GET /admin/analytics/conversions-api': ok(mockCapiConfig),
  'POST /admin/analytics/conversions-api': ok({ message: 'capi saved' }),
  'GET /admin/analytics/gmc': ok(mockGmcConfig),
  'POST /admin/analytics/gmc': ok({ message: 'gmc saved' }),
  'POST /admin/analytics/gmc/feed/generate': ok({ message: 'gmc feed generated' }),
  'GET /admin/analytics/facebook-catalogue': ok(mockFbCatalogConfig),
  'POST /admin/analytics/facebook-catalogue': ok({ message: 'fb catalog saved' }),
  'POST /admin/analytics/facebook-catalogue/feed/generate': ok({ message: 'fb feed generated' }),
  'GET /admin/analytics/custom-scripts': ok(mockCustomScriptsConfig),
  'POST /admin/analytics/custom-scripts': ok({ message: 'custom scripts saved' }),
  'GET /admin/analytics/sitemap': ok(mockSitemapConfig),
  'POST /admin/analytics/sitemap': ok({ message: 'sitemap saved' }),
  'POST /admin/analytics/sitemap/generate': ok({ message: 'sitemap generated' }),
  'GET /admin/analytics/seo': ok(mockGlobalSeoConfig),
  'POST /admin/analytics/seo': ok({ message: 'seo saved' }),
}
