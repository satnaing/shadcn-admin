import {
  //IconBarrierBlock,
  //IconBrowserCheck,
 // IconBug,
  //IconChecklist,
  //IconError404,
  //IconHelp,
  IconLayoutDashboard,
  //IconLock,
  //IconLockAccess,
  //IconMessages,
  //IconNotification,
  //IconPackages,
 // IconPalette,
 // IconServerOff,
 // IconSettings,
 // IconTool,
 // IconUserCog,
  //IconUserOff,
  IconUsers,
  IconClipboardText,
  IconUsersGroup,
  IconMoneybag,
  IconReceiptRupee,
  IconDevicesCheck,
  IconTrendingUp
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
// import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Admin Panel',
      logo: Command,
      plan: 'Stashfin',
    },
  ],
  navGroups: [
    {
      title: 'Services',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },

        {
          title: 'Customers',
          url: '/customers',
          icon: IconUsersGroup,
        },
        {
          title: 'UPI',
          url: '/upi',
          icon: IconMoneybag,
        },
        {
          title: 'UPI Analytics',
          url: '/upi_analytics',
          icon: IconMoneybag,
        },
        {
          title: 'BBPS',
          url: '/bbps',
          icon: IconReceiptRupee,
        },
         {
          title: 'Bureau',
          url: '/bureau',
          icon: IconClipboardText,
         },
         {
          title: 'Wealth IFA',
          url: '/wealth-ifa',
          icon: IconDevicesCheck,
         },
         {
          title: 'Credit Repair',
          url: '/credit-repair',
          icon: IconTrendingUp,
         },
         {
          title: 'Purge Bureau Consent',
          url: '/bureau-consent',
          icon: IconClipboardText,
         }
        
        // Clerk links removed
      ],
    },
    /****REMOVED FROM SIDE BAR IN UI , BUT LINK STILL AVAILABLE */
    // {
    //   title: 'Pages',
    //   items: [
    //     {
    //       title: 'Auth',
    //       icon: IconLockAccess,
    //       items: [
    //         {
    //           title: 'Sign In',
    //           url: '/sign-in',
    //         },
    //         {
    //           title: 'Sign In (2 Col)',
    //           url: '/sign-in-2',
    //         },
    //         {
    //           title: 'Sign Up',
    //           url: '/sign-up',
    //         },
    //         {
    //           title: 'Forgot Password',
    //           url: '/forgot-password',
    //         },
    //         {
    //           title: 'OTP',
    //           url: '/otp',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Errors',
    //       icon: IconBug,
    //       items: [
    //         {
    //           title: 'Unauthorized',
    //           url: '/401',
    //           icon: IconLock,
    //         },
    //         {
    //           title: 'Forbidden',
    //           url: '/403',
    //           icon: IconUserOff,
    //         },
    //         {
    //           title: 'Not Found',
    //           url: '/404',
    //           icon: IconError404,
    //         },
    //         {
    //           title: 'Internal Server Error',
    //           url: '/500',
    //           icon: IconServerOff,
    //         },
    //         {
    //           title: 'Maintenance Error',
    //           url: '/503',
    //           icon: IconBarrierBlock,
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   title: 'Other',
    //   items: [
    //     {
    //       title: 'Settings',
    //       icon: IconSettings,
    //       items: [
    //         {
    //           title: 'Profile',
    //           url: '/settings',
    //           icon: IconUserCog,
    //         },
    //         {
    //           title: 'Account',
    //           url: '/settings/account',
    //           icon: IconTool,
    //         },
    //         {
    //           title: 'Appearance',
    //           url: '/settings/appearance',
    //           icon: IconPalette,
    //         },
    //         {
    //           title: 'Notifications',
    //           url: '/settings/notifications',
    //           icon: IconNotification,
    //         },
    //         {
    //           title: 'Display',
    //           url: '/settings/display',
    //           icon: IconBrowserCheck,
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Help Center',
    //       url: '/help-center',
    //       icon: IconHelp,
    //     },
    //   ],
    //  },
  ],
}
