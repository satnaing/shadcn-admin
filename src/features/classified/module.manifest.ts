import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the Classified ads module (AEC core `classified_product` feature).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const classifiedManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'classified',
  name: 'Classified ads',
  description:
    'Customer and seller classified listings moderation and listing packages',
  version: '1.0.0',
  icon: 'Megaphone',
  required: false,
  requires: [],
  admin_menu: {
    group: {
      key: 'classified',
      icon: 'Megaphone',
      order: 120,
      panels: ['admin'],
    },
    items: [
      {
        key: 'classifiedProducts',
        route: '/admin/classified',
        order: 1,
        permission: 'classified.index',
      },
      {
        key: 'classifiedPackages',
        route: '/admin/classified/packages',
        order: 2,
        permission: 'classified.packages',
      },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.CLASSIFIED` (`shared/permissions.ts`). */
export const classifiedPermissions = [
  'classified.index',
  'classified.publish',
  'classified.delete',
  'classified.packages',
  'classified.packages_manage',
] as const
