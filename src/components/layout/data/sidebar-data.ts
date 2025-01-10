import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug, IconChartBar,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconNotification,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'ecaring',
    email: 'hamid@ecaring.com',
    avatar: '/images/ecaring.png',
  },
  teams: [
    {
      name: 'Ecaring',
      logo: '/images/ecaring.png',
      plan: 'Tenant',
    },
    {
      name: 'Acme Inc',
      logo: '/images/ecaring.png',
      plan: 'Tenant',
    },
    {
      name: 'Acme Corp.',
      logo: '/images/ecaring.png',
      plan: 'Tenant',
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
          title: 'Insights',
          icon: IconChartBar,
          items: [
            {
              title: 'KPI Dashboard',
              url: '/insights',
            },
            {
              title: 'Client Margin',
              url: '/insights',
            },
            {
              title: 'Staff Margin',
              url: '/insights',
            },
            {
              title: 'Payor Margin',
              url: '/insights',
            },
            {
              title: 'Service Margin',
              url: '/insights',
            }, {
              title: 'Monthly Trends',
              url: '/insights',
            }, {
              title: 'Messages',
              url: '/insights',
            },
          ],
        },
      ],
    },
    {
      title: 'Users',
      items: [
        {
          title: 'Clients',
          url: '/users',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Staff',
          url: '/users',
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
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
    {
      title: 'Other',
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
        {
          title: 'Help Center',
          url: '/help-center',
          icon: IconHelp,
        },
      ],
    },
  ],
}
