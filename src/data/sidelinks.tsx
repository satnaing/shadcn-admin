import {
  IconBoxSeam,
  IconChartHistogram,
  IconCircleLetterA,
  IconCircleLetterB,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconTruck,
  IconUsers,
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
    title: 'Dashboard',
    label: '',
    href: 'dashboard',
    icon: <IconLayoutDashboard size={18} />,
    sub: [
      {
        title: 'Dashboard 1',
        href: '/dashboard',
        icon: <IconCircleLetterA size={18} />,
      },
      {
        title: 'Dashboard 2',
        href: '/dashboard-2',
        icon: <IconCircleLetterB size={18} />,
      },
    ],
  },
  {
    title: 'Chats',
    label: '9',
    href: 'chats',
    icon: <IconMessages size={18} />,
  },
  {
    title: 'Partners',
    label: '',
    href: 'partners',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'Requests',
    label: '10',
    href: 'requests',
    icon: <IconRouteAltLeft size={18} />,
    sub: [
      {
        title: 'Trucks',
        label: '9',
        href: 'trucks',
        icon: <IconTruck size={18} />,
      },
      {
        title: 'Cargos',
        label: '',
        href: 'cargos',
        icon: <IconBoxSeam size={18} />,
      },
    ],
  },
  {
    title: 'Analysis',
    label: '',
    href: 'analysis',
    icon: <IconChartHistogram size={18} />,
  },
]
