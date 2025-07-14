import { 
  IconChecklist,
  IconLayoutDashboard,
  IconNotification,
  IconPackages,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
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
          url: '/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Feature Request',
          url: '/apps',
          icon: IconPackages,
        },
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
              title: 'Post Settings',
              url: '/settings/post',
              icon: IconTool,
            },
            {
              title: 'Comments Settings',
              url: '/settings/comments',
              icon: IconNotification,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: IconPalette,
            },
            
          ],
        },
      ],
    },
  ],
}
