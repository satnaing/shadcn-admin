import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
} from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    label: 'Backlog',
    value: 'backlog' as const,
    key: 'backlog' as const,
    icon: HelpCircle,
  },
  {
    label: 'Todo',
    value: 'todo' as const,
    key: 'todo' as const,
    icon: Circle,
  },
  {
    label: 'In Progress',
    value: 'in progress' as const,
    key: 'inProgress' as const,
    icon: Timer,
  },
  {
    label: 'Done',
    value: 'done' as const,
    key: 'done' as const,
    icon: CheckCircle,
  },
  {
    label: 'Canceled',
    value: 'canceled' as const,
    key: 'canceled' as const,
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high' as const,
    icon: ArrowUp,
  },
  {
    label: 'Critical',
    value: 'critical' as const,
    icon: AlertCircle,
  },
]

/** Labels with translated display text (reactive to language changes). */
export function useTaskLabels() {
  const { t } = useTranslation('tasks')
  return useMemo(
    () => labels.map((l) => ({ ...l, label: t(`labels.${l.value}`) })),
    [t]
  )
}

/** Statuses with translated display text (reactive to language changes). */
export function useTaskStatuses() {
  const { t } = useTranslation('tasks')
  return useMemo(
    () => statuses.map((s) => ({ ...s, label: t(`statuses.${s.key}`) })),
    [t]
  )
}

/** Priorities with translated display text (reactive to language changes). */
export function useTaskPriorities() {
  const { t } = useTranslation('tasks')
  return useMemo(
    () => priorities.map((p) => ({ ...p, label: t(`priorities.${p.value}`) })),
    [t]
  )
}
