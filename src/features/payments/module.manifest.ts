import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the Payments module (AEC addons `offline_payment` and `payriff`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const paymentsManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'payments',
  name: 'Payments',
  description: 'Offline payment methods, offline orders, wallet and package payment requests, payout methods and Payriff',
  version: '1.0.0',
  icon: 'Wallet',
  required: false,
  requires: ['payment'],
  admin_menu: {
    group: { key: 'payments', icon: 'Wallet', order: 140, panels: ['admin'] },
    items: [
      { key: 'paymentsManual', route: '/admin/payments', order: 1, permission: 'payments.index' },
      { key: 'paymentsOfflineOrders', route: '/admin/payments/offline-orders', order: 2, permission: 'payments.offline_orders' },
      { key: 'paymentsWallet', route: '/admin/payments/wallet-requests', order: 3, permission: 'payments.wallet_requests' },
      { key: 'paymentsSellerPackages', route: '/admin/payments/seller-packages', order: 4, permission: 'payments.seller_packages' },
      { key: 'paymentsCustomerPackages', route: '/admin/payments/customer-packages', order: 5, permission: 'payments.customer_packages' },
      { key: 'paymentsPayouts', route: '/admin/payments/payout-methods', order: 6, permission: 'payments.payout_methods' },
      { key: 'paymentsPayriff', route: '/admin/payments/payriff', order: 7, permission: 'payments.payriff' },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.PAYMENTS` (`shared/permissions.ts`). */
export const paymentsPermissions = [
  'payments.index',
  'payments.manual_manage',
  'payments.offline_orders',
  'payments.wallet_requests',
  'payments.wallet_manage',
  'payments.seller_packages',
  'payments.seller_packages_manage',
  'payments.customer_packages',
  'payments.customer_packages_manage',
  'payments.payout_methods',
  'payments.payout_methods_manage',
  'payments.payriff',
  'payments.payriff_manage',
] as const
