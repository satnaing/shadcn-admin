import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the Map provider module (AEC addon `map_provider`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const mapProviderManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'map-provider',
  name: 'Map provider',
  description: 'Map provider (OpenStreetMap, MapTiler, Google, Yandex), API keys and default location',
  version: '1.0.0',
  icon: 'MapPin',
  required: false,
  requires: [],
  admin_menu: {
    group: { key: 'mapProvider', icon: 'MapPin', order: 140, panels: ['admin'] },
    items: [{ key: 'mapProviderSettings', route: '/admin/map-provider', order: 1, permission: 'map_provider.index' }],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.MAP_PROVIDER` (`shared/permissions.ts`). */
export const mapProviderPermissions = ['map_provider.index', 'map_provider.manage'] as const
