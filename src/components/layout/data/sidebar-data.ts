import {
  IconArrowCapsule,
  IconBrowserCheck,
  IconCalendar,
  IconChecklist,
  IconDatabase,
  IconGraph,
  IconLayoutDashboard,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { Command} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Penster.ai',
      logo: Command,
      plan: 'AI based company',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Content',
          url: '/content',
          icon: IconChecklist,
        },
        {
          title: 'Calender',
          url: '/calender',
          icon: IconCalendar,
        },
        {
          title: 'Wrok Flow',
          url: '/work-flow',
          icon: IconGraph,
        },

        {
          title: 'Integrations',
          url: '/integration',
          icon: IconArrowCapsule,

        },
        {
          title: 'Referncedata',
          url: '/referencedata',
          icon: IconDatabase,
        },
        
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    
    {
      title: 'Settings',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: IconBrowserCheck,
            },
          ],
        },
        
      ],
    },
  ],
}
