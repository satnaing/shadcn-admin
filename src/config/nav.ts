import {
  Activity,
  Banknote,
  Beef,
  Building,
  Coffee,
  Package,
  Ruler,
  Settings,
  ToggleRight,
  TrendingUp,
  Users,
} from 'lucide-react'

export const getStoreNav = (shopId?: string | null) => [
  // {
  //   title: 'Dashboard',
  //   url: '/',
  //   icon: LayoutDashboard,
  // },
  {
    title: 'Live Ops',
    url: '/operations',
    icon: Activity,
    items: [
      { title: 'KDS (Kitchen Display)', url: '/operations' },
      { title: 'Order Manager', url: '/operations/orders' },
      { title: 'Active Carts', url: '/operations/carts' },
      { title: 'Shift Manager', url: '/operations/shift' },
    ],
  },
  {
    title: 'Inventory',
    url: '/inventory/stock',
    icon: Package,
    items: [
      { title: 'Stock Levels', url: '/inventory/stock' },
      {
        title: 'Inventory Logs',
        url: shopId ? `/shops/${shopId}/inventory/logs` : '#',
      },
    ],
  },
  {
    title: 'Shop Menu',
    url: shopId ? `/shops/${shopId}/menu` : '/menu/availability',
    icon: ToggleRight,
  },
  {
    title: 'Team & Roster',
    url: '/staff/roster',
    icon: Users,
  },
  {
    title: 'Store Settings',
    url: '/settings/store',
    icon: Settings,
  },
]

export const hqNav = [
  {
    title: 'Overview',
    url: '/hq/overview',
    icon: Activity,
  },
  {
    title: 'Master Catalog',
    url: '/menu/catalog',
    icon: Coffee,
    items: [
      { title: 'Categories', url: '/menu/categories' },
      { title: 'Products', url: '/menu/products' },
      {
        title: 'Option Groups',
        url: '/menu/options',
      },
      {
        title: 'Collections',
        url: '/menu/collections',
      },
      {
        title: 'Badges',
        url: '/menu/badges',
      },
      {
        title: 'Availability',
        url: '/menu/availability',
      },
    ],
  },
  {
    title: 'Inventory',
    url: '/inventory',
    icon: Package,
    items: [
      { title: 'Ingredients', url: '/inventory/ingredients', icon: Beef },
      { title: 'Units', url: '/inventory/units', icon: Ruler },
    ],
  },
  {
    title: 'Growth & CRM',
    url: '/growth',
    icon: TrendingUp,
    items: [
      { title: 'Customers (CRM)', url: '/growth/customers' },
      { title: 'Promotions', url: '/growth/promotions' },
      { title: 'Vouchers', url: '/growth/vouchers' },
      { title: 'Announcements', url: '/growth/announcements' },
      { title: 'Points & Referrals', url: '/growth/loyalty' },
      { title: 'Membership Program', url: '/growth/membership' },
      { title: 'Reviews', url: '/growth/reviews' },
    ],
  },
  {
    title: 'All Employees',
    url: '/staff/employees',
    icon: Users,
  },
  {
    title: 'Finance',
    url: '/settings/financial',
    icon: Banknote,
    items: [
      { title: 'Tax & Surcharges', url: '/settings/financial' },
      { title: 'Cash Drawers', url: '/settings/financial/cash-drawers' },
    ],
  },
  {
    title: 'Business Settings',
    url: '/settings/business',
    icon: Building,
    items: [
      { title: 'Business Profile', url: '/settings/business' },
      { title: 'Roles & Permissions', url: '/settings/roles' },
      { title: 'Audit Logs', url: '/settings/audit-logs' },
      { title: 'Mobile App', url: '/settings/mobile-app' },
    ],
  },
]
