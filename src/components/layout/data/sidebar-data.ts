import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChartBar,
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
  IconCalendarStats,
  IconVocabulary,
  IconChartArcs,
  IconUserDollar,
  IconCalendarCheck,
  IconCurrencyDollar,
  IconList,
  IconUserStar,
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
          title: 'Users',
          icon: IconUsers,
          items: [
            {
              title: 'Clients',
              url: '/users',
            },
            {
              title: 'Staff',
              url: '/users',
            },
          ],
        },
        {
          title: 'Schedule',
          icon: IconCalendarStats,
          items: [
            {
              title: 'Shift Logs',
              url: '/schedule',
            },
            {
              title: 'Client',
              url: '/schedule',
            },
            {
              title: 'Staff',
              url: '/schedule',
            },
            {
              title: 'Day',
              url: '/schedule',
            },
            {
              title: 'Low Margin',
              url: '/schedule',
            },
            {
              title: 'Shift Monitor',
              url: '/schedule',
            },
            {
              title: 'Staff Shifts LIVE View',
              url: '/schedule',
            },
            {
              title: 'Staff Metrics',
              url: '/schedule',
            },
          ],
        },
        {
          title: 'Verification',
          icon: IconCalendarCheck,
          items: [
            {
              title: 'Verify',
              url: '/verification',
            },
            {
              title: 'EVV',
              url: '/verification',
            },
          ],
        },
        {
          title: 'Referrals',
          url: '/referrals',
          icon: IconList,
        },

      ],
    },
    {
      title: 'Report',
      items: [
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
        {
          title: 'Reports',
          icon: IconChartArcs,
          items: [
            {
              title: 'Saved Reports',
              url: '/reports',
            },
            {
              title: 'Visits',
              url: '/reports',
            },
            {
              title: 'Client',
              url: '/reports',
            },
            {
              title: 'Staff',
              url: '/reports',
            },
            {
              title: 'Authorization',
              url: '/reports',
            },
            {
              title: 'Dates & Docs',
              url: '/reports',
            },
            {
              title: 'Fraud Exclusions',
              url: '/reports',
            },
            {
              title: 'Worker Registry',
              url: '/reports',
            },
          ],
        },
        {
          title: 'Activities',
          url: '/activities',
          icon: IconVocabulary,
        },
      ],
    },
    {
      title: 'Finance',
      items: [
        {
          title: 'Payors',
          url: '/payors',
          icon: IconUserDollar,
        },
        {
          title: 'Payroll',
          icon: IconCurrencyDollar,
          items: [
            {
              title: 'Summary',
              url: '/payroll',
            },
            {
              title: 'History',
              url: '/payroll',
            },
          ],
        },
        {
          title: 'Billing',
          icon: IconCurrencyDollar,
          items: [
            {
              title: 'Create',
              url: '/billing',
            },
            {
              title: 'Pending',
              url: '/billing',
            },
            {
              title: 'History',
              url: '/billing',
            },
          ],
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
      title: 'Settings',
      items: [
        {
          title: 'System',
          url: '/system',
          icon: IconSettings,
        },
        {
          title: 'Admin',
          url: '/admin',
          icon: IconUserStar,
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
