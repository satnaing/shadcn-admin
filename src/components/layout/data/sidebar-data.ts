import {
  IconChecklist,
  IconLayoutDashboard,
  IconNotification,
  IconPackages,
  IconSettings,
  IconTool,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Commentify',
    email: 'commentify@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },

  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
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
          icon: IconLayoutDashboard,
        },
        {
          title: 'History',
          url: '/history',
          icon: IconChecklist,
        },
        {
          title: 'Feature Request',
          url: '/featurerequest',
          icon: IconPackages,
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
}
