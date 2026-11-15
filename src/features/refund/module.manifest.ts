import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the refund module (AEC addon `refund_system`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const refundManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'refund',
  name: 'Refunds',
  description: 'Return requests, disputes, refund reasons and category-based refund periods',
  version: '1.0.0',
  icon: 'RotateCcw',
  required: false,
  requires: ['order', 'payment'],
  admin_menu: {
    group: { key: 'refund', icon: 'RotateCcw', order: 150, panels: ['admin'] },
    items: [
      { key: 'refundRequests', route: '/admin/refund', order: 1, permission: 'refund.index' },
      { key: 'refundDisputes', route: '/admin/refund/disputes', order: 2, permission: 'refund.disputes' },
      { key: 'refundReasons', route: '/admin/refund/reasons', order: 3, permission: 'refund.reasons' },
      { key: 'refundCategories', route: '/admin/refund/categories', order: 4, permission: 'refund.categories' },
      { key: 'refundSettings', route: '/admin/refund/settings', order: 5, permission: 'refund.settings' },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.REFUND` (`shared/permissions.ts`). */
export const refundPermissions = [
  'refund.index',
  'refund.requests_manage',
  'refund.disputes',
  'refund.disputes_manage',
  'refund.reasons',
  'refund.reasons_manage',
  'refund.categories',
  'refund.settings',
] as const
