import {
  Package,
  Target,
  BookOpen,
  PlayCircle,
  Building2,
  UserCheck,
  Activity,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'Operations',
      items: [
        {
          title: 'Activity',
          url: '/activity',
          icon: Activity,
        },
        {
          title: 'Plays',
          url: '/plays',
          icon: PlayCircle,
        },
      ],
    },
    {
      title: 'Intelligence',
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
          title: 'Tools',
          url: '/tools',
          icon: Package,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          title: 'Senders',
          url: '/connected-accounts',
          icon: UserCheck,
        },
      ],
    },
  ],
}
