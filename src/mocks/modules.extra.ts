import type { ModuleItem } from '@/api/modules.types'

type Row = [id: string, name: string, description: string, icon: string, required: boolean, enabled: boolean, requires: string[], installed?: boolean]

const rows: Row[] = [
  ['identity', 'Identity', 'Users, roles and permissions', 'Users', true, true, []],
  ['catalog', 'Catalog', 'Categories, brands, attributes and units', 'Layers', true, true, []],
  ['product', 'Product', 'Products, variants and stock', 'Package', true, true, ['catalog']],
  ['order', 'Order', 'Carts, checkout and orders', 'ClipboardList', true, true, ['product']],
  ['payment', 'Payment', 'Payment methods and transactions', 'CreditCard', true, true, ['order']],
  ['vendor', 'Multi-vendor', 'Sellers, shops and commissions', 'Store', true, true, ['identity']],
  ['media', 'Media', 'Uploaded files and image processing', 'Image', true, true, []],
  ['settings', 'Settings', 'Languages, currency, e-mail and SEO', 'Settings', true, true, []],
  ['coupon', 'Coupons & deals', 'Coupons, flash deals and category discounts', 'Ticket', false, true, ['order']],
  ['affiliate', 'Affiliate', 'Referral links and commissions', 'Share2', false, false, ['vendor']],
  ['club-point', 'Club points', 'Loyalty points and wallet conversion', 'Coins', false, false, ['order']],
  ['payriff', 'Payriff', 'Payriff payment driver', 'CreditCard', false, true, ['payment']],
  ['offline-payment', 'Offline payment', 'Manual and offline payment methods', 'Wallet', false, false, ['payment']],
  ['ai-tools', 'AI management', 'AI translation and content generation', 'Sparkles', false, true, []],
  ['otp', 'OTP', 'SMS one-time-password login', 'Smartphone', false, false, ['identity']],
  ['auction', 'Auction', 'Auction products and bidding', 'Gavel', false, false, ['product'], false],
  ['map-provider', 'Map provider', 'Maps for pickup points and delivery', 'Map', false, false, [], false],
  ['google-one-tap', 'Google One Tap', 'One-tap sign-in with Google', 'KeyRound', false, false, ['identity'], false],
]

/** Modules that have no `admin_menu` (so the sidebar mock ignores them). Mutable: toggled by PATCH/batch. */
export const extraModules: ModuleItem[] = rows.map(
  ([id, name, description, icon, required, enabled, requires, installed = true]) => ({
    id, name, description, icon, required, enabled, requires, installed, version: '1.0.0',
  })
)

/** Available updates by module id (mutable; cleared by `POST /admin/modules/:id/update`). */
export const availableUpdates: Record<string, string> = { pos: '1.1.0', coupon: '1.2.0', 'theme-xshop': '1.0.3' }
