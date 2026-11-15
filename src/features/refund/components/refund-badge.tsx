import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

type Variant = 'default' | 'secondary' | 'outline' | 'destructive'

const VARIANTS: Record<string, Record<string, Variant>> = {
  status: { pending: 'outline', approved: 'default', rejected: 'destructive' },
  decision: { pending: 'outline', approved: 'default', rejected: 'destructive', na: 'secondary' },
  channel: { wallet: 'secondary', offline: 'outline' },
  kind: { customer: 'secondary', rejection: 'destructive' },
}

interface Props {
  group: keyof typeof VARIANTS
  value: string
}

export function RefundBadge({ group, value }: Props) {
  const { t } = useTranslation('refund')

  return <Badge variant={VARIANTS[group][value] ?? 'secondary'}>{t(`${group}.${value}`)}</Badge>
}
