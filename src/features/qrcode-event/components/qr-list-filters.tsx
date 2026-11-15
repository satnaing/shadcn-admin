import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { QrCampaignSelect } from './qr-campaign-select'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
  /** Exact-IP filter (log table). */
  withIp?: boolean
}

const str = (v: unknown) => (typeof v === 'string' ? v : undefined)

/** Campaign + date-range filters shared by the codes and log tables (they live in the URL → server params). */
export function QrListFilters({ search, navigate, withIp }: Props) {
  const { t } = useTranslation('qrcode_event')
  const set = (key: string, value: string | undefined) =>
    navigate({ search: (prev) => ({ ...prev, [key]: value || undefined, page: undefined }) })

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <QrCampaignSelect value={str(search.campaign_id)} onChange={(v) => set('campaign_id', v)} />
      <Input
        type='date'
        className='w-40'
        aria-label={t('filters.dateFrom')}
        value={str(search.date_from) ?? ''}
        onChange={(e) => set('date_from', e.target.value)}
      />
      <Input
        type='date'
        className='w-40'
        aria-label={t('filters.dateTo')}
        value={str(search.date_to) ?? ''}
        onChange={(e) => set('date_to', e.target.value)}
      />
      {withIp && (
        <Input
          className='w-40'
          placeholder={t('filters.ip')}
          aria-label={t('filters.ip')}
          defaultValue={str(search.ip) ?? ''}
          onBlur={(e) => set('ip', e.target.value.trim())}
        />
      )}
    </div>
  )
}
