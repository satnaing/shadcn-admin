import {
  IconBarrierBlock,
  IconBug,
  IconChecklist,
  IconError404,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconServerOff,
  IconUserOff,
  IconBuildingStore,
  IconDevices,
  IconPrinter,
  IconSettingsPlus,
  IconRecycle,
  IconReport,
  IconCreditCardRefund,
  IconCapture,
  IconUsers,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'IT Asset Management',
      logo: Command,
      //plan: 'Vite + ShadcnUI',
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
          title: 'Tasks',
          url: '/tasks',
          icon: IconChecklist,
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Inventory',
          icon: IconBuildingStore,
          items: [
            {
              title: 'Devices',
              url: '/inventory/devices',
              icon: IconDevices,
            },
            {
              title: 'Devices Categories',
              url: '/inventory/devices-categories',
              icon: IconSettingsPlus,
            },
            {
              title: 'Cartridges',
              url: '/inventory/cartridges',
              icon: IconPrinter,
            },
            {
              title: 'Cartridges Categories',
              url: '/inventory/cartridges-categories',
              icon: IconSettingsPlus,
            },
          ]
        },

        {
          title: 'Acquisition',
          icon: IconCapture,
          items: [
            {
              title: 'My Requests',
              url: '/acquisition/requests',
            },
            {
              title: 'My Devices',
              url: '/acquisition/my-devices'
            },
            {
              title: 'WaitList',
              url: '/acquisition/waitlist'
            },

          ]
        },

        {
          title: 'Handover',
          icon: IconCreditCardRefund,
          items: [
            {
              title: 'My Requests',
              url: '/handover/requests',
            },
            {
              title: 'Handover Requests',
              url: '/handover/handover-list'
            },
          ]
        },
        {
          title: 'Disposal',
          icon: IconRecycle,
          items: [
            {
              title: 'My Requests',
              url: '/disposal/requests',
            },
            {
              title: 'Disposal Requests',
              url: '/disposal/disposal-requests-list'
            },
            {
              title: 'Disposal List',
              url: '/disposal/disposed-devices'
            }
          ]
        },
        {
          title: 'Reports',
          icon: IconReport,
          items: [
            {
              title: 'Inventory Report',
              url: '/reports/inventory',
            },
            {
              title: 'Acquisition Report',
              url: '/reports/acquisition'
            },
            {
              title: 'Handover Report',
              url: '/reports/handover'
            },
          ]
        },

        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: '/401',
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: '/403',
              icon: IconUserOff,
            },
            {
              title: 'Not Found',
              url: '/404',
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: '/500',
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/503',
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
  ],
}
