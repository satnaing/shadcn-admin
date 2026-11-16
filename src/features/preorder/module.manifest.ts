import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the preorder module (AEC addon `preorder`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const preorderManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'preorder',
  name: 'Preorder',
  description:
    'Preorder products, deposits and the multi-step preorder workflow',
  version: '1.0.0',
  icon: 'CalendarClock',
  required: false,
  requires: ['product', 'order'],
  admin_menu: {
    group: {
      key: 'preorder',
      icon: 'CalendarClock',
      order: 160,
      panels: ['admin'],
    },
    items: [
      {
        key: 'preorderDashboard',
        route: '/admin/preorder',
        order: 1,
        permission: 'preorder.index',
      },
      {
        key: 'preorderProducts',
        route: '/admin/preorder/products',
        order: 2,
        permission: 'preorder.products',
      },
      {
        key: 'preorderOrders',
        route: '/admin/preorder/orders',
        order: 3,
        permission: 'preorder.orders',
      },
      {
        key: 'preorderCommissions',
        route: '/admin/preorder/commissions',
        order: 4,
        permission: 'preorder.commissions',
      },
      {
        key: 'preorderConversations',
        route: '/admin/preorder/conversations',
        order: 5,
        permission: 'preorder.conversations',
      },
      {
        key: 'preorderQueries',
        route: '/admin/preorder/queries',
        order: 6,
        permission: 'preorder.queries',
      },
      {
        key: 'preorderReviews',
        route: '/admin/preorder/reviews',
        order: 7,
        permission: 'preorder.reviews',
      },
      {
        key: 'preorderFaqs',
        route: '/admin/preorder/faqs',
        order: 8,
        permission: 'preorder.faqs',
      },
      {
        key: 'preorderNotifications',
        route: '/admin/preorder/notifications',
        order: 9,
        permission: 'preorder.notifications',
      },
      {
        key: 'preorderSettings',
        route: '/admin/preorder/settings',
        order: 10,
        permission: 'preorder.settings',
      },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.PREORDER` (`shared/permissions.ts`). */
export const preorderPermissions = [
  'preorder.index',
  'preorder.products',
  'preorder.products_manage',
  'preorder.orders',
  'preorder.orders_manage',
  'preorder.commissions',
  'preorder.conversations',
  'preorder.conversations_manage',
  'preorder.queries',
  'preorder.queries_manage',
  'preorder.reviews',
  'preorder.reviews_manage',
  'preorder.faqs',
  'preorder.faqs_manage',
  'preorder.notifications',
  'preorder.notifications_manage',
  'preorder.settings',
] as const
