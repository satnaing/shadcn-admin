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
import { useTranslation } from 'react-i18next'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export function useSidebarData(): SidebarData {
  const { t } = useTranslation()

  return {
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
        title: t('sidebar.general'),
        items: [
          {
            title: t('sidebar.dashboard'),
            url: '/',
            icon: LayoutDashboard,
          },
          {
            title: t('sidebar.tasks'),
            url: '/tasks',
            icon: ListTodo,
          },
          {
            title: t('sidebar.apps'),
            url: '/apps',
            icon: Package,
          },
          {
            title: t('sidebar.chats'),
            url: '/chats',
            badge: '3',
            icon: MessagesSquare,
          },
          {
            title: t('sidebar.users'),
            url: '/users',
            icon: Users,
          },
          {
            title: t('sidebar.secured_by_clerk'),
            icon: ClerkLogo,
            items: [
              {
                title: t('sidebar.sign_in'),
                url: '/clerk/sign-in',
              },
              {
                title: t('sidebar.sign_up'),
                url: '/clerk/sign-up',
              },
              {
                title: t('sidebar.user_management'),
                url: '/clerk/user-management',
              },
            ],
          },
        ],
      },
      {
        title: t('sidebar.pages'),
        items: [
          {
            title: t('sidebar.auth'),
            icon: ShieldCheck,
            items: [
              {
                title: t('sidebar.sign_in'),
                url: '/sign-in',
              },
              {
                title: t('sidebar.sign_in_2col'),
                url: '/sign-in-2',
              },
              {
                title: t('sidebar.sign_up'),
                url: '/sign-up',
              },
              {
                title: t('sidebar.forgot_password'),
                url: '/forgot-password',
              },
              {
                title: t('sidebar.otp'),
                url: '/otp',
              },
            ],
          },
          {
            title: t('sidebar.errors'),
            icon: Bug,
            items: [
              {
                title: t('sidebar.unauthorized'),
                url: '/errors/unauthorized',
                icon: Lock,
              },
              {
                title: t('sidebar.forbidden'),
                url: '/errors/forbidden',
                icon: UserX,
              },
              {
                title: t('sidebar.not_found'),
                url: '/errors/not-found',
                icon: FileX,
              },
              {
                title: t('sidebar.internal_server_error'),
                url: '/errors/internal-server-error',
                icon: ServerOff,
              },
              {
                title: t('sidebar.maintenance_error'),
                url: '/errors/maintenance-error',
                icon: Construction,
              },
            ],
          },
        ],
      },
      {
        title: t('sidebar.other'),
        items: [
          {
            title: t('sidebar.settings'),
            icon: Settings,
            items: [
              {
                title: t('sidebar.profile'),
                url: '/settings',
                icon: UserCog,
              },
              {
                title: t('sidebar.account'),
                url: '/settings/account',
                icon: Wrench,
              },
              {
                title: t('sidebar.appearance'),
                url: '/settings/appearance',
                icon: Palette,
              },
              {
                title: t('sidebar.notifications'),
                url: '/settings/notifications',
                icon: Bell,
              },
              {
                title: t('sidebar.display'),
                url: '/settings/display',
                icon: Monitor,
              },
            ],
          },
          {
            title: t('sidebar.help_center'),
            url: '/help-center',
            icon: HelpCircle,
          },
        ],
      },
    ],
  }
}
