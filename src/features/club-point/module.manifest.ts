import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the club-point module (AEC addon `club_point`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const clubPointManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'club-point',
  name: 'Club points',
  description:
    'Loyalty points earned per product and converted to wallet money',
  version: '1.0.0',
  icon: 'Coins',
  required: false,
  requires: ['order'],
  admin_menu: {
    group: { key: 'clubPoint', icon: 'Coins', order: 180, panels: ['admin'] },
    items: [
      {
        key: 'clubPointEarnings',
        route: '/admin/club-point',
        order: 1,
        permission: 'club_point.index',
      },
      {
        key: 'clubPointProducts',
        route: '/admin/club-point/products',
        order: 2,
        permission: 'club_point.products',
      },
      {
        key: 'clubPointConfig',
        route: '/admin/club-point/config',
        order: 3,
        permission: 'club_point.config',
      },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.CLUB_POINT` (`shared/permissions.ts`). */
export const clubPointPermissions = [
  'club_point.index',
  'club_point.products',
  'club_point.products_manage',
  'club_point.config',
  'club_point.config_manage',
] as const
