import { Building2, LayoutDashboard } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarSupervisorData: SidebarData = {
  user: {
    name: 'Supervisor',
    email: 'supervisor@xshop.az',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'xShop Partner',
      logo: Building2,
      plan: 'Supervisor',
    },
  ],
  navGroups: [
    {
      key: 'dashboard',
      title: 'nav.dashboard',
      items: [
        {
          key: 'supervisor-dashboard',
          title: 'nav.dashboard',
          url: '/supervisor',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      key: 'sellers',
      title: 'nav.sellers',
      items: [],
    },
    {
      key: 'earnings',
      title: 'nav.earnings',
      items: [],
    },
    {
      key: 'payouts',
      title: 'nav.payouts',
      items: [],
    },
  ],
}
