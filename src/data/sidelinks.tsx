import {
  IconBoxSeam,
  IconChartHistogram,
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
  isActive: boolean
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '128',
    href: 'dashboard',
    icon: <IconLayoutDashboard size={18} />,
    isActive: true,
  },
  {
    title: 'Chats',
    label: '9',
    href: 'chats',
    icon: <IconMessages size={18} />,
    isActive: false,
  },
  {
    title: 'Partners',
    label: '',
    href: 'partners',
    icon: <IconUsers size={18} />,
    isActive: false,
  },
  {
    title: 'Requests',
    label: '12',
    href: 'requests',
    icon: <IconRouteAltLeft size={18} />,
    isActive: false,
    sub: [
      {
        title: 'Trucks',
        label: '9',
        href: 'trucks',
        isActive: false,
        icon: <IconTruck size={18} />,
      },
      {
        title: 'Cargos',
        label: '',
        href: 'cargos',
        isActive: false,
        icon: <IconBoxSeam size={18} />,
      },
    ],
  },
  {
    title: 'Analysis',
    label: '',
    href: 'analysis',
    icon: <IconChartHistogram size={18} />,
    isActive: false,
  },
]
