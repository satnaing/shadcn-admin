import {
  Package,
  Target,
  BookOpen,
  PlayCircle,
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
              title: 'ICP Profiles',
              url: '/knowledge/icp',
              icon: Target,
            },
          ],
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
