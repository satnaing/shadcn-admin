import type { ModuleRaw } from '@/api/menu.types'
import { affiliateManifest } from '@/features/affiliate/module.manifest'
import { aiManifest } from '@/features/ai/module.manifest'
import { classifiedManifest } from '@/features/classified/module.manifest'
import { clubPointManifest } from '@/features/club-point/module.manifest'
import { courierManifest } from '@/features/courier/module.manifest'
import { mapProviderManifest } from '@/features/map-provider/module.manifest'
import { qrcodeEventManifest } from '@/features/qrcode-event/module.manifest'
import { otpManifest } from '@/features/otp/module.manifest'
import { paymentsManifest } from '@/features/payments/module.manifest'
import { posManifest } from '@/features/pos/module.manifest'
import { preorderManifest } from '@/features/preorder/module.manifest'
import { refundManifest } from '@/features/refund/module.manifest'
import { wholesaleManifest } from '@/features/wholesale/module.manifest'

/** Installed modules (module.json shape). Mutable on purpose: PATCH /admin/modules/:id toggles `enabled`. */
export const mockModules: ModuleRaw[] = [
  { ...posManifest, enabled: true },
  { ...wholesaleManifest, enabled: true },
  { ...qrcodeEventManifest, enabled: true },
  { ...refundManifest, enabled: true },
  { ...preorderManifest, enabled: true },
  { ...affiliateManifest, enabled: true },
  { ...clubPointManifest, enabled: true },
  { ...classifiedManifest, enabled: true },
  { ...courierManifest, enabled: true },
  { ...otpManifest, enabled: true },
  { ...mapProviderManifest, enabled: true },
  { ...paymentsManifest, enabled: true },
  { ...aiManifest, enabled: true },
  { id: 'theme-xshop', name: 'Theme xShop', description: 'xShop storefront theme package', version: '1.0.0', icon: 'Palette', required: false, enabled: true, requires: [] },
  { id: 'theme-senseihost', name: 'Theme SenseiHost', description: 'SenseiHost storefront theme package', version: '1.0.0', icon: 'Palette', required: false, enabled: false, requires: [] },
]
