import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the Wholesale module (AEC addon `wholesale`, admin screens).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const wholesaleManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'wholesale',
  name: 'Wholesale',
  description:
    'Wholesale catalogue: quantity price tiers and minimum order quantities',
  version: '1.0.0',
  icon: 'Boxes',
  required: false,
  requires: ['product'],
  admin_menu: {
    group: { key: 'wholesale', icon: 'Boxes', order: 110, panels: ['admin'] },
    items: [
      {
        key: 'wholesaleProducts',
        route: '/admin/wholesale',
        order: 1,
        permission: 'wholesale.index',
      },
      {
        key: 'wholesaleCreate',
        route: '/admin/wholesale/new',
        order: 2,
        permission: 'wholesale.create',
      },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.WHOLESALE` (`shared/permissions.ts`). */
export const wholesalePermissions = [
  'wholesale.index',
  'wholesale.inhouse',
  'wholesale.sellers',
  'wholesale.create',
  'wholesale.edit',
  'wholesale.delete',
] as const
