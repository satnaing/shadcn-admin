import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the Seller packages module (AEC addon `seller-subscription-addon`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const sellerPackageManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'seller-package',
  name: 'Seller packages',
  description: 'Subscription packages that limit what a seller shop can do',
  version: '1.0.0',
  icon: 'Crown',
  required: false,
  requires: [],
  admin_menu: {
    group: { key: 'sellerPackage', icon: 'Crown', order: 130, panels: ['admin'] },
    items: [
      {
        key: 'sellerPackages',
        route: '/admin/seller-package',
        order: 1,
        permission: 'seller_package.index',
      },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.SELLER_PACKAGE` (`shared/permissions.ts`). */
export const sellerPackagePermissions = [
  'seller_package.index',
  'seller_package.create',
  'seller_package.edit',
  'seller_package.delete',
] as const
