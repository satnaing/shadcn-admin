import { useTranslation } from 'react-i18next'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQrCampaigns } from '../hooks/use-qrcode-event'

const ALL = 'all'

interface Props {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
}

/** Campaign picker used as a page filter ("all campaigns" = no value). */
export function QrCampaignSelect({ value, onChange, className = 'w-56' }: Props) {
  const { t } = useTranslation('qrcode_event')
  const { data } = useQrCampaigns({ per_page: 100, sort: 'name' })

  return (
    <Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
      <SelectTrigger className={className} aria-label={t('filters.campaign')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{t('filters.allCampaigns')}</SelectItem>
        {(data?.data ?? []).map((c) => (
          <SelectItem key={c.id} value={String(c.id)}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
