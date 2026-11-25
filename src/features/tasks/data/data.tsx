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
import { useTranslation } from 'react-i18next'

// 静态值数组，用于路由 schema 验证（不需要翻译）
export const statusValues = [
  'backlog',
  'todo',
  'in progress',
  'done',
  'canceled',
] as const

export const priorityValues = ['low', 'medium', 'high', 'critical'] as const

// Hook 版本，用于 UI 展示（含翻译和图标）
export function useTasksData() {
  const { t } = useTranslation()

  const labels = [
    {
      value: 'bug',
      label: t('tasks.bug'),
    },
    {
      value: 'feature',
      label: t('tasks.feature'),
    },
    {
      value: 'documentation',
      label: t('tasks.documentation'),
    },
  ]

  const translatedStatuses = [
    {
      label: t('tasks.backlog'),
      value: 'backlog' as const,
      icon: HelpCircle,
    },
    {
      label: t('tasks.todo'),
      value: 'todo' as const,
      icon: Circle,
    },
    {
      label: t('tasks.in_progress'),
      value: 'in progress' as const,
      icon: Timer,
    },
    {
      label: t('tasks.done'),
      value: 'done' as const,
      icon: CheckCircle,
    },
    {
      label: t('tasks.canceled'),
      value: 'canceled' as const,
      icon: CircleOff,
    },
  ]

  const translatedPriorities = [
    {
      label: t('tasks.low'),
      value: 'low' as const,
      icon: ArrowDown,
    },
    {
      label: t('tasks.medium'),
      value: 'medium' as const,
      icon: ArrowRight,
    },
    {
      label: t('tasks.high'),
      value: 'high' as const,
      icon: ArrowUp,
    },
    {
      label: t('tasks.critical'),
      value: 'critical' as const,
      icon: AlertCircle,
    },
  ]

  return {
    labels,
    statuses: translatedStatuses,
    priorities: translatedPriorities,
  }
}
