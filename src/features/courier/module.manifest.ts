import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the courier module (AEC addon `delivery_boy`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 * Admin screens come first; the last three are the courier's own panel (panel `courier`).
 */
export const courierManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'courier',
  name: 'Couriers',
  description:
    'Courier accounts, cash collections, payouts and the courier delivery panel',
  version: '1.0.0',
  icon: 'Truck',
  required: false,
  requires: ['order'],
  admin_menu: {
    group: {
      key: 'courier',
      icon: 'Truck',
      order: 130,
      panels: ['admin', 'courier'],
    },
    items: [
      {
        key: 'courierList',
        route: '/admin/courier',
        order: 1,
        permission: 'courier.index',
      },
      {
        key: 'courierPayments',
        route: '/admin/courier/payments',
        order: 2,
        permission: 'courier.payments',
      },
      {
        key: 'courierCollections',
        route: '/admin/courier/collections',
        order: 3,
        permission: 'courier.collections',
      },
      {
        key: 'courierCancelRequests',
        route: '/admin/courier/cancel-requests',
        order: 4,
        permission: 'courier.cancel_requests',
      },
      {
        key: 'courierConfig',
        route: '/admin/courier/config',
        order: 5,
        permission: 'courier.config',
      },
      {
        key: 'courierDeliveries',
        route: '/admin/courier/deliveries',
        order: 6,
        permission: 'courier.deliveries',
      },
      {
        key: 'courierCash',
        route: '/admin/courier/cash',
        order: 7,
        permission: 'courier.cash_report',
      },
      {
        key: 'courierEarnings',
        route: '/admin/courier/earnings',
        order: 8,
        permission: 'courier.earnings',
      },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.COURIER` (`shared/permissions.ts`). */
export const courierPermissions = [
  'courier.index',
  'courier.create',
  'courier.edit',
  'courier.ban',
  'courier.collect',
  'courier.pay',
  'courier.payments',
  'courier.collections',
  'courier.cancel_requests',
  'courier.config',
  'courier.config_manage',
  'courier.deliveries',
  'courier.deliveries_manage',
  'courier.cash_report',
  'courier.earnings',
] as const
