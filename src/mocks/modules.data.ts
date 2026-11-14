import type { ModuleRaw } from '@/api/menu.types'

/** Installed modules (module.json shape). Mutable on purpose: PATCH /admin/modules/:id toggles `enabled`. */
export const mockModules: ModuleRaw[] = [
  {
    id: 'pos', name: 'POS', description: 'Point of sale terminal, orders and catalogue', version: '1.0.0',
    icon: 'ShoppingCart', required: false, enabled: true, requires: [],
    admin_menu: {
      group: { key: 'pos', icon: 'ShoppingCart', order: 100, panels: ['admin', 'seller'] },
      items: [
        { key: 'posTerminal', route: '/admin/pos', order: 1, permission: 'pos.index' },
        { key: 'posOrders', route: '/admin/pos/orders', order: 2, permission: 'pos.orders' },
        { key: 'posProducts', route: '/admin/pos/products', order: 3, permission: 'pos.products' },
      ],
    },
  },
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
  {
    id: 'delivery-boy', name: 'Delivery boys', description: 'Courier accounts, collections and cancel requests', version: '1.0.0',
    icon: 'Truck', required: false, enabled: true, requires: ['pos'],
    admin_menu: {
      group: { key: 'deliveryBoy', icon: 'Truck', order: 130, panels: ['admin', 'courier'] },
      items: [
        { key: 'deliveryBoys', route: '/admin/delivery-boys', order: 1, permission: 'delivery_boys.index' },
        { key: 'deliveryCollections', route: '/admin/delivery-boys/collections', order: 2, permission: 'delivery_boys.collections' },
      ],
    },
  },
  {
    id: 'qrcode-event', name: 'QR code events', description: 'QR code driven event registration', version: '1.0.0',
    icon: 'QrCode', required: false, enabled: false, requires: [],
    admin_menu: {
      group: { key: 'qrcodeEvent', icon: 'QrCode', order: 140, panels: ['admin'] },
      items: [{ key: 'qrcodeEvents', route: '/admin/qrcode-events', order: 1, permission: 'qrcode_events.index' }],
    },
  },
  { id: 'theme-xshop', name: 'Theme xShop', description: 'xShop storefront theme package', version: '1.0.0', icon: 'Palette', required: false, enabled: true, requires: [] },
  { id: 'theme-senseihost', name: 'Theme SenseiHost', description: 'SenseiHost storefront theme package', version: '1.0.0', icon: 'Palette', required: false, enabled: false, requires: [] },
]
