import {
  IconApps,
  IconBarrierBlock,
  IconBoxSeam,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconError404,
  IconExclamationCircle,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconServerOff,
  IconSettings,
  IconTruck,
  IconUserShield,
  IconUsers,
  IconLock,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'sidebar.dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'sidebar.tasks',
    label: '3',
    href: '/tasks',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'sidebar.chats',
    label: '9',
    href: '/chats',
    icon: <IconMessages size={18} />,
  },
  {
    title: 'sidebar.apps',
    label: '',
    href: '/apps',
    icon: <IconApps size={18} />,
  },
  {
    title: 'sidebar.authentication',
    label: '',
    href: '',
    icon: <IconUserShield size={18} />,
    sub: [
      {
        title: 'sidebar.auth_sign_in_email_password',
        label: '',
        href: '/sign-in',
        icon: <IconHexagonNumber1 size={18} />,
      },
      {
        title: 'sidebar.auth_sign_in_box',
        label: '',
        href: '/sign-in-2',
        icon: <IconHexagonNumber2 size={18} />,
      },
      {
        title: 'sidebar.auth_sign_up',
        label: '',
        href: '/sign-up',
        icon: <IconHexagonNumber3 size={18} />,
      },
      {
        title: 'sidebar.auth_forgot_password',
        label: '',
        href: '/forgot-password',
        icon: <IconHexagonNumber4 size={18} />,
      },
      {
        title: 'sidebar.auth_otp',
        label: '',
        href: '/otp',
        icon: <IconHexagonNumber5 size={18} />,
      },
    ],
  },
  {
    title: 'sidebar.users',
    label: '',
    href: '/users',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'sidebar.requests',
    label: '10',
    href: '/requests',
    icon: <IconRouteAltLeft size={18} />,
    sub: [
      {
        title: 'sidebar.requests_trucks',
        label: '9',
        href: '/trucks',
        icon: <IconTruck size={18} />,
      },
      {
        title: 'sidebar.requests_cargos',
        label: '',
        href: '/cargos',
        icon: <IconBoxSeam size={18} />,
      },
    ],
  },
  {
    title: 'sidebar.analytics',
    label: '',
    href: '/analysis',
    icon: <IconChartHistogram size={18} />,
  },
  {
    title: 'sidebar.extra_components',
    label: '',
    href: '/extra-components',
    icon: <IconComponents size={18} />,
  },
  {
    title: 'sidebar.error_pages',
    label: '',
    href: '',
    icon: <IconExclamationCircle size={18} />,
    sub: [
      {
        title: 'sidebar.error_not_found',
        label: '',
        href: '/404',
        icon: <IconError404 size={18} />,
      },
      {
        title: 'sidebar.error_internal_server',
        label: '',
        href: '/500',
        icon: <IconServerOff size={18} />,
      },
      {
        title: 'sidebar.error_maintenance',
        label: '',
        href: '/503',
        icon: <IconBarrierBlock size={18} />,
      },
      {
        title: 'sidebar.error_unauthorised',
        label: '',
        href: '/401',
        icon: <IconLock size={18} />,
      },
    ],
  },
  {
    title: 'sidebar.settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
