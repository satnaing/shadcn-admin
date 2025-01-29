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

// Search fields
export const SEARCH_FIELD = 'title' as const

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
      label: 'High',
      value: 'high',
      icon: IconArrowUp,
    },
    {
      label: 'Medium',
      value: 'medium',
      icon: IconArrowRight,
    },
    {
      label: 'Low',
      value: 'low',
      icon: IconArrowDown,
    },
  ],
} as const
export const FILTER_FIELDS = Object.keys(
  FILTER_FIELD_LABELS,
) as (keyof typeof FILTER_FIELD_LABELS)[]

// Pagination items per page options
export const PAGINATION_PER_PAGE_ITEMS = ['10', '20', '30', '40', '50'] as const
export const PAGINATION_PER_PAGE_DEFAULT = PAGINATION_PER_PAGE_ITEMS[0]
