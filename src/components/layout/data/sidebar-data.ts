import {
  Activity,
  Coffee,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings2,
  Users,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Coffee Shop 1',
      logo: Coffee,
      plan: 'Enterprise',
    },
    {
      name: 'Coffee Shop 2',
      logo: Coffee,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Live Operations',
          url: '/operations',
          icon: Activity,
          items: [
            { title: 'KDS (Kitchen Display)', url: '/operations' },
            { title: 'Order Manager', url: '/operations/orders' },
            { title: 'Table Map', url: '/operations/tables' },
          ],
        },
        {
          title: 'Menu',
          url: '/menu',
          icon: Coffee,
          items: [
            { title: 'Products', url: '/menu/products' },
            { title: 'Categories', url: '/menu/categories' },
            { title: 'Option Groups', url: '/menu/options' },
            { title: 'Badges', url: '/menu/badges' },
            { title: 'Price Books', url: '/menu/pricing' },
          ],
        },
        {
          title: 'Inventory',
          url: '/inventory',
          icon: Package,
          items: [
            { title: 'Stock Levels', url: '/inventory/stock' },
            { title: 'Inventory Logs', url: '/inventory/logs' },
            { title: 'Purchase Orders', url: '/inventory/purchasing' },
            { title: 'Suppliers', url: '/inventory/suppliers' },
            { title: 'Wastage Logs', url: '/inventory/waste' },
          ],
        },
        {
          title: 'Staff',
          url: '/staff',
          icon: Users,
          items: [
            { title: 'Employees', url: '/staff' },
            { title: 'Shift Roster', url: '/staff/roster' },
            { title: 'Performance', url: '/staff/performance' },
          ],
        },
        {
          title: 'Growth & CRM',
          url: '/growth',
          icon: Megaphone,
          items: [
            { title: 'Customers (CRM)', url: '/growth/customers' },
            { title: 'Promotions', url: '/growth/promotions' },
            { title: 'Vouchers', url: '/growth/vouchers' },
            { title: 'Reviews', url: '/growth/reviews' },
          ],
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings2,
          items: [
            { title: 'Store Profile', url: '/settings/store' },
            { title: 'Financials', url: '/settings/financial' },
            { title: 'Active Sessions', url: '/settings/sessions' },
          ],
        },
      ],
    },
  ],
}
