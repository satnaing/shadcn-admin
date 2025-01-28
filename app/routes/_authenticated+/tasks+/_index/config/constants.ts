import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconStopwatch,
} from '@tabler/icons-react'

// Faceted filter options
export const FILTER_FIELD_LABELS = {
  status: [
    {
      value: 'backlog',
      label: 'Backlog',
      icon: IconExclamationCircle,
    },
    {
      value: 'todo',
      label: 'Todo',
      icon: IconCircle,
    },
    {
      value: 'in progress',
      label: 'In Progress',
      icon: IconStopwatch,
    },
    {
      value: 'done',
      label: 'Done',
      icon: IconCircleCheck,
    },
    {
      value: 'canceled',
      label: 'Canceled',
      icon: IconCircleX,
    },
  ],
  priority: [
    {
      label: 'Low',
      value: 'low',
      icon: IconArrowDown,
    },
    {
      label: 'Medium',
      value: 'medium',
      icon: IconArrowRight,
    },
    {
      label: 'High',
      value: 'high',
      icon: IconArrowUp,
    },
  ],
} as const

// Pagination items per page options
export const PAGINATION_PER_PAGE_ITEMS = ['10', '20', '30', '40', '50'] as const
