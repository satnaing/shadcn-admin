import { CheckCircle2, Eye, XCircle } from 'lucide-react'

export const versionStatuses = [
  {
    value: 'enabled',
    label: '开启',
    icon: CheckCircle2,
  },
  {
    value: 'observing',
    label: '观察',
    icon: Eye,
  },
  {
    value: 'disabled',
    label: '关闭',
    icon: XCircle,
  },
]
