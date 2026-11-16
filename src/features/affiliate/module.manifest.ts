import type { ModuleRaw } from '@/api/menu.types'

/**
 * `module.json` of the affiliate module (AEC addon `affiliate_system`).
 * admin2 reads it through `mocks/modules.data.ts` (`GET /admin/modules`, `GET /admin/menu`);
 * the real API reads the module's own `module.json`. Menu item keys resolve in `nav.json`.
 */
export const affiliateManifest: Omit<ModuleRaw, 'enabled'> = {
  id: 'affiliate',
  name: 'Affiliate',
  description:
    'Referral commissions, affiliate users, withdraw requests and referral logs',
  version: '1.0.0',
  icon: 'Share2',
  required: false,
  requires: ['order', 'identity'],
  admin_menu: {
    group: { key: 'affiliate', icon: 'Share2', order: 170, panels: ['admin'] },
    items: [
      {
        key: 'affiliateConfig',
        route: '/admin/affiliate',
        order: 1,
        permission: 'affiliate.index',
      },
      {
        key: 'affiliateForm',
        route: '/admin/affiliate/form',
        order: 2,
        permission: 'affiliate.form',
      },
      {
        key: 'affiliateUsers',
        route: '/admin/affiliate/users',
        order: 3,
        permission: 'affiliate.users',
      },
      {
        key: 'affiliateReferrals',
        route: '/admin/affiliate/referrals',
        order: 4,
        permission: 'affiliate.referrals',
      },
      {
        key: 'affiliateWithdraws',
        route: '/admin/affiliate/withdraws',
        order: 5,
        permission: 'affiliate.withdraws',
      },
      {
        key: 'affiliateLogs',
        route: '/admin/affiliate/logs',
        order: 6,
        permission: 'affiliate.logs',
      },
    ],
  },
}

/** Permission keys the module declares; they live in `PERMISSIONS.AFFILIATE` (`shared/permissions.ts`). */
export const affiliatePermissions = [
  'affiliate.index',
  'affiliate.config_manage',
  'affiliate.form',
  'affiliate.users',
  'affiliate.users_manage',
  'affiliate.users_pay',
  'affiliate.payments',
  'affiliate.referrals',
  'affiliate.withdraws',
  'affiliate.withdraws_manage',
  'affiliate.logs',
] as const
