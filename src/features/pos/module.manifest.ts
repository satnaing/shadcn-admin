import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the POS module (AEC addon `pos_system`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 * The seller panel uses the same screens (panel `seller`, filtered by permission).
 */
export const posManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'pos',
  name: 'POS',
  description: 'Point-of-sale terminal, POS orders, POS product list and thermal receipt settings',
  version: '1.0.0',
  icon: 'ShoppingCart',
  required: false,
  requires: ['product', 'order'],
  admin_menu: {
    group: { key: 'pos', icon: 'ShoppingCart', order: 100, panels: ['admin', 'seller'] },
    items: [
      { key: 'posTerminal', route: '/admin/pos', order: 1, permission: 'pos.index' },
      { key: 'posOrders', route: '/admin/pos/orders', order: 2, permission: 'pos.orders' },
      { key: 'posProducts', route: '/admin/pos/products', order: 3, permission: 'pos.products' },
      { key: 'posConfig', route: '/admin/pos/config', order: 4, permission: 'pos.config' },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.POS` (`shared/permissions.ts`). */
export const posPermissions = [
  'pos.index',
  'pos.orders',
  'pos.products',
  'pos.products_manage',
  'pos.config',
  'pos.config_manage',
  'pos.activation_manage',
] as const
