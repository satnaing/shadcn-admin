import {
  Package,
  Target,
  BookOpen,
  PlayCircle,
  Building2,
  UserCheck,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Plays',
          url: '/plays',
          icon: PlayCircle,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Knowledge',
          icon: BookOpen,
          items: [
            {
              title: 'General',
              url: '/knowledge/general',
              icon: Building2,
            },
            {
              title: 'ICP Profiles',
              url: '/knowledge/icp',
              icon: Target,
            },
          ],
        },
        {
          title: 'Connected Accounts',
          url: '/connected-accounts',
          icon: UserCheck,
        },
        {
          title: 'Integrations',
          url: '/integrations',
          icon: Package,
        },
      ],
    },
  ],
}
