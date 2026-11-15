import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

type Variant = 'default' | 'secondary' | 'outline' | 'destructive'

const VARIANTS: Record<string, Record<string, Variant>> = {
  campaign: { draft: 'secondary', active: 'default', paused: 'outline', finished: 'secondary' },
  code: { unused: 'secondary', checked: 'outline', claimed: 'default', disabled: 'destructive' },
  result: {
    win: 'default', lose: 'secondary', used: 'outline', already_checked: 'outline',
    invalid: 'destructive', disabled: 'destructive', blocked: 'destructive',
  },
  prize: { cash: 'default', product: 'outline', gift: 'secondary' },
}

interface Props {
  group: keyof typeof VARIANTS
  value: string
}

export function QrBadge({ group, value }: Props) {
  const { t } = useTranslation('qrcode_event')

  return <Badge variant={VARIANTS[group][value] ?? 'secondary'}>{t(`${group}.${value}`)}</Badge>
}
