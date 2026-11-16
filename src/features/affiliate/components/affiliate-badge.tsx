import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

type Variant = 'default' | 'secondary' | 'outline' | 'destructive'

const VARIANTS: Record<string, Variant> = {
  pending: 'outline',
  approved: 'default',
  rejected: 'destructive',
  user_registration_first_purchase: 'secondary',
  product_sharing: 'default',
  category_wise_affiliate: 'outline',
}

/** Withdraw status (`status.*`) or commission type of a log row (`type.*`). */
export function AffiliateBadge({
  group,
  value,
}: {
  group: 'status' | 'type'
  value: string
}) {
  const { t } = useTranslation('affiliate')

  return (
    <Badge variant={VARIANTS[value] ?? 'secondary'}>
      {t(`${group}.${value}`)}
    </Badge>
  )
}
