import type { ModuleRaw } from '@/api/menu.types'
import { affiliateManifest } from '@/features/affiliate/module.manifest'
import { clubPointManifest } from '@/features/club-point/module.manifest'
import { courierManifest } from '@/features/courier/module.manifest'
import { qrcodeEventManifest } from '@/features/qrcode-event/module.manifest'
import { posManifest } from '@/features/pos/module.manifest'
import { preorderManifest } from '@/features/preorder/module.manifest'
import { refundManifest } from '@/features/refund/module.manifest'

/** Installed modules (module.json shape). Mutable on purpose: PATCH /admin/modules/:id toggles `enabled`. */
export const mockModules: ModuleRaw[] = [
  { ...posManifest, enabled: true },
  {
    id: 'wholesale', name: 'Wholesale', description: 'Wholesale catalogue and price tiers', version: '1.0.0',
    icon: 'Boxes', required: false, enabled: true, requires: [],
    admin_menu: {
      group: { key: 'wholesale', icon: 'Boxes', order: 110, panels: ['admin', 'seller'] },
      items: [
        { key: 'wholesaleProducts', route: '/admin/wholesale-products', order: 1, permission: 'wholesale.index' },
        { key: 'wholesaleCreate', route: '/admin/wholesale-products/create', order: 2, permission: 'wholesale.create' },
      ],
    },
  },
  {
    id: 'classified', name: 'Classified Ads', description: 'Classified listings and packages', version: '1.0.0',
    icon: 'Megaphone', required: false, enabled: false, requires: [],
    admin_menu: {
      group: { key: 'classified', icon: 'Megaphone', order: 120, panels: ['admin'] },
      items: [{ key: 'classifiedProducts', route: '/admin/classified-products', order: 1, permission: 'classified.index' }],
    },
  },
  { ...qrcodeEventManifest, enabled: true },
  { ...refundManifest, enabled: true },
  { ...preorderManifest, enabled: true },
  { ...affiliateManifest, enabled: true },
  { ...clubPointManifest, enabled: true },
  { ...courierManifest, enabled: true },
  { id: 'theme-xshop', name: 'Theme xShop', description: 'xShop storefront theme package', version: '1.0.0', icon: 'Palette', required: false, enabled: true, requires: [] },
  { id: 'theme-senseihost', name: 'Theme SenseiHost', description: 'SenseiHost storefront theme package', version: '1.0.0', icon: 'Palette', required: false, enabled: false, requires: [] },
]
