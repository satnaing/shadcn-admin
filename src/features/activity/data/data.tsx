import { CircleCheck, CircleX, Clock, AlertTriangle, Loader2, PauseCircle } from 'lucide-react'

export const executionStatuses = [
  {
    label: 'Awaiting Approval',
    value: 'AWAITING_APPROVAL' as const,
    icon: PauseCircle,
  },
  {
    label: 'Cancelled',
    value: 'CANCELLED' as const,
    icon: CircleX,
  },
  {
    label: 'Completed',
    value: 'COMPLETED' as const,
    icon: CircleCheck,
  },
  {
    label: 'Failed',
    value: 'FAILED' as const,
    icon: AlertTriangle,
  },
  {
    label: 'In Progress',
    value: 'IN_PROGRESS' as const,
    icon: Loader2,
  },
  {
    label: 'Pending',
    value: 'PENDING' as const,
    icon: Clock,
  },
]

export const executionEntityTypes = [
  {
    label: 'Company',
    value: 'COMPANY' as const,
  },
  {
    label: 'Contact',
    value: 'CONTACT' as const,
  },
]
