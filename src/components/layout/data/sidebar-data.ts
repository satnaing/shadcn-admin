import {
  IconCash,
  IconChecklist,
  IconLayoutDashboard,
  IconNotification,
  IconPackages,
  IconSettings,
  IconTool,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Commentify',
    email: 'commentify@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },

  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'History',
          url: '/history',
          icon: IconChecklist,
        },
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Post Settings',
              url: '/settings/post',
              icon: IconTool,
            },
            {
              title: 'Comments Settings',
              url: '/settings/comments',
              icon: IconNotification,
            },
          ],
        },
      ],
    },
  ],
  bottomGroups :[
    {
      title: 'Function',
      items: [
        {
          title: 'Feature Request',
          url: '/featurerequest',
          icon: IconPackages,
        },
        {
          title: 'Pricing',
          url: '/pricing',
          icon: IconCash,
        },
      ],
    }
  ]
}
