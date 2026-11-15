import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the QR code event module (AEC addon `qrcode_event`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const qrcodeEventManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'qrcode-event',
  name: 'QR code events',
  description: 'Scratch-code campaigns: prizes, code batches, scan log and claim tracking',
  version: '1.0.0',
  icon: 'QrCode',
  required: false,
  requires: [],
  admin_menu: {
    group: { key: 'qrcodeEvent', icon: 'QrCode', order: 140, panels: ['admin'] },
    items: [
      { key: 'qrcodeEventStats', route: '/admin/qrcode-event', order: 1, permission: 'qrcode_event.index' },
      { key: 'qrcodeEventCampaigns', route: '/admin/qrcode-event/campaigns', order: 2, permission: 'qrcode_event.campaigns' },
      { key: 'qrcodeEventBatches', route: '/admin/qrcode-event/batches', order: 3, permission: 'qrcode_event.batches' },
      { key: 'qrcodeEventCodes', route: '/admin/qrcode-event/codes', order: 4, permission: 'qrcode_event.codes' },
      { key: 'qrcodeEventLogs', route: '/admin/qrcode-event/logs', order: 5, permission: 'qrcode_event.logs' },
      { key: 'qrcodeEventSettings', route: '/admin/qrcode-event/settings', order: 6, permission: 'qrcode_event.settings' },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.QRCODE_EVENT` (`shared/permissions.ts`). */
export const qrcodeEventPermissions = [
  'qrcode_event.index',
  'qrcode_event.settings',
  'qrcode_event.campaigns',
  'qrcode_event.campaigns_manage',
  'qrcode_event.batches',
  'qrcode_event.batches_create',
  'qrcode_event.codes',
  'qrcode_event.codes_manage',
  'qrcode_event.logs',
] as const
