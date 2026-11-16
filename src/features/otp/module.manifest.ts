import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the OTP module (AEC addon `otp_system`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const otpManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'otp',
  name: 'OTP & SMS',
  description: 'One-time-password switches, SMS gateways, SMS templates and bulk SMS',
  version: '1.0.0',
  icon: 'Smartphone',
  required: false,
  requires: ['identity'],
  admin_menu: {
    group: { key: 'otp', icon: 'Smartphone', order: 130, panels: ['admin'] },
    items: [
      { key: 'otpSettings', route: '/admin/otp', order: 1, permission: 'otp.index' },
      { key: 'otpGateways', route: '/admin/otp/gateways', order: 2, permission: 'otp.gateways' },
      { key: 'otpTemplates', route: '/admin/otp/templates', order: 3, permission: 'otp.templates' },
      { key: 'otpBulkSms', route: '/admin/otp/bulk-sms', order: 4, permission: 'otp.bulk_sms' },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.OTP` (`shared/permissions.ts`). */
export const otpPermissions = [
  'otp.index',
  'otp.settings_manage',
  'otp.gateways',
  'otp.gateways_manage',
  'otp.templates',
  'otp.templates_manage',
  'otp.bulk_sms',
] as const
