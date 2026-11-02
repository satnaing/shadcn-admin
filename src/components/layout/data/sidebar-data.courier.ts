import { Bike, LayoutDashboard } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarCourierData: SidebarData = {
  user: {
    name: 'Courier',
    email: 'courier@xshop.az',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'xShop Express',
      logo: Bike,
      plan: 'Courier',
    },
  ],
  navGroups: [
    {
      key: 'dashboard',
      title: 'nav.dashboard',
      items: [
        {
          key: 'courier-dashboard',
          title: 'nav.dashboard',
          url: '/courier',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      key: 'deliveries',
      title: 'nav.deliveries',
      items: [],
    },
    {
      key: 'earnings',
      title: 'nav.earnings',
      items: [],
    },
    {
      key: 'profile',
      title: 'nav.profile',
      items: [],
    },
  ],
}
