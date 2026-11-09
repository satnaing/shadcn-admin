import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
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
      title: 'sidebar.general',
      items: [
        {
          title: 'sidebar.dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'sidebar.tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'sidebar.apps',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'sidebar.chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'sidebar.users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'sidebar.clerk',
          icon: ClerkLogo,
          items: [
            {
              title: 'sidebar.signIn',
              url: '/clerk/sign-in',
            },
            {
              title: 'sidebar.signUp',
              url: '/clerk/sign-up',
            },
            {
              title: 'sidebar.userManagement',
              url: '/clerk/user-management',
            },
          ],
        },
      ],
    },
    {
      title: 'sidebar.pages',
      items: [
        {
          title: 'sidebar.auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'sidebar.signIn',
              url: '/sign-in',
            },
            {
              title: 'sidebar.signIn2Col',
              url: '/sign-in-2',
            },
            {
              title: 'sidebar.signUp',
              url: '/sign-up',
            },
            {
              title: 'sidebar.forgotPassword',
              url: '/forgot-password',
            },
            {
              title: 'sidebar.otp',
              url: '/otp',
            },
          ],
        },
        {
          title: 'sidebar.errors',
          icon: Bug,
          items: [
            {
              title: 'sidebar.unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'sidebar.forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'sidebar.notFound',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'sidebar.internalServerError',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'sidebar.maintenanceError',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'sidebar.other',
      items: [
        {
          title: 'sidebar.settings',
          icon: Settings,
          items: [
            {
              title: 'sidebar.profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'sidebar.account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'sidebar.appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'sidebar.notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'sidebar.display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'sidebar.helpCenter',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
