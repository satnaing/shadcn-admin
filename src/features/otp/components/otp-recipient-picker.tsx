import { useTranslation } from 'react-i18next'
import { otpApi } from '@/api/modules/otp.api'
import { EntityPicker } from '@/components/shared/entity-picker'

interface Props {
  value: string[]
  onChange: (phones: string[]) => void
}

/** Server-searched multi-select of customers with a phone number (shared EntityPicker); chosen numbers are the value. */
export function OtpRecipientPicker({ value, onChange }: Props) {
  const { t } = useTranslation('otp')

  return (
    <EntityPicker
      multiple
      queryKey={['otp', 'recipient-picker']}
      placeholder={t('bulk.search')}
      fetcher={async (q) => (await otpApi.recipients(q)).data.map((r) => ({ id: r.phone, label: r.name, hint: r.phone }))}
      selected={value.map((phone) => ({ id: phone, label: phone }))}
      onChange={(options) => onChange(options.map((o) => String(o.id)))}
    />
  )
}
