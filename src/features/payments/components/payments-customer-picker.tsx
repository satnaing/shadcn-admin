import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { paymentsApi } from '@/api/modules/payments.api'
import { EntityPicker } from '@/components/shared/entity-picker'
import type { EntityOption } from '@/components/shared/entity-picker.logic'

interface Props {
  value: number | undefined
  onChange: (id: number | undefined) => void
}

/** Server-searched single customer (shared EntityPicker, 2 characters minimum). */
export function PaymentsCustomerPicker({ value, onChange }: Props) {
  const { t } = useTranslation('payments')
  const [chosen, setChosen] = useState<EntityOption[]>([])

  return (
    <EntityPicker
      queryKey={['payments', 'customer-picker']}
      placeholder={t('recharge.search')}
      fetcher={async (q) => (await paymentsApi.customers(q)).data.map((c) => ({ id: c.id, label: c.name, hint: c.email }))}
      selected={value ? chosen : []}
      onChange={(options) => {
        setChosen(options)
        onChange(options[0] ? Number(options[0].id) : undefined)
      }}
    />
  )
}
