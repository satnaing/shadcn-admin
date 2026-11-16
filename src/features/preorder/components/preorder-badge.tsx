import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import type { StepStatus } from '../data/preorder.type'

type Variant = 'default' | 'secondary' | 'outline' | 'destructive'

const STEP_VARIANT: Record<StepStatus, Variant> = {
  none: 'secondary',
  pending: 'outline',
  accepted: 'default',
  denied: 'destructive',
}

export function StepBadge({ status }: { status: StepStatus }) {
  const { t } = useTranslation('preorder')

  return (
    <Badge variant={STEP_VARIANT[status]}>{t(`stepStatus.${status}`)}</Badge>
  )
}

export function OwnerBadge({ type }: { type: 'admin' | 'seller' }) {
  const { t } = useTranslation('preorder')

  return (
    <Badge variant={type === 'admin' ? 'secondary' : 'outline'}>
      {t(`owner.${type}`)}
    </Badge>
  )
}

export function ActiveBadge({ active }: { active: boolean }) {
  const { t } = useTranslation('preorder')

  return (
    <Badge variant={active ? 'default' : 'secondary'}>
      {t(active ? 'state.active' : 'state.inactive')}
    </Badge>
  )
}
