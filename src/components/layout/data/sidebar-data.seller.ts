import { LayoutDashboard, Store } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarSellerData: SidebarData = {
  user: {
    name: 'Seller',
    email: 'seller@xshop.az',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'xShop Vendor',
      logo: Store,
      plan: 'Seller',
    },
  ],
  navGroups: [
    {
      key: 'dashboard',
      title: 'nav.dashboard',
      items: [
        {
          key: 'seller-dashboard',
          title: 'nav.dashboard',
          url: '/seller',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      key: 'products',
      title: 'nav.products',
      items: [],
    },
    {
      key: 'orders-sales',
      title: 'nav.ordersSales',
      items: [],
    },
    {
      key: 'finance',
      title: 'nav.finance',
      items: [],
    },
    {
      key: 'communication',
      title: 'nav.communication',
      items: [],
    },
    {
      key: 'marketing-promotions',
      title: 'nav.marketingPromotions',
      items: [],
    },
    {
      key: 'content-design',
      title: 'nav.contentDesign',
      items: [],
    },
    {
      key: 'settings',
      title: 'nav.settings',
      items: [],
    },
  ],
}
