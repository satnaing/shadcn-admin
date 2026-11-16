import { useEffect } from 'react'
import { type UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormSelectField } from '@/components/forms/form-select-field'
import type { AddressFormValues } from '../data/pos.schema'
import type { LookupOption } from '../data/pos.type'
import { usePosLookups } from '../hooks/use-pos'

const opts = (list: LookupOption[]) =>
  list.map((o) => ({ value: String(o.id), label: o.name }))

/** Country → state → city: each level lists only the children of the level above and resets when it changes. */
export function PosRegionFields({
  form,
}: {
  form: UseFormReturn<AddressFormValues>
}) {
  const { t } = useTranslation('pos')
  const lookups = usePosLookups().data?.data
  const country = useWatch({ control: form.control, name: 'country_id' })
  const state = useWatch({ control: form.control, name: 'state_id' })

  // Only a user edit fires with the field name; resetting a child cascades to its own children.
  useEffect(() => {
    const sub = form.watch((_values, { name, type }) => {
      if (type !== 'change') return
      if (name === 'country_id') form.setValue('state_id', 0)
      if (name === 'country_id' || name === 'state_id')
        form.setValue('city_id', 0)
    })
    return () => sub.unsubscribe()
  }, [form])

  return (
    <>
      <FormSelectField
        form={form}
        name='country_id'
        numeric
        label={t('address.country')}
        options={opts(lookups?.countries ?? [])}
      />
      <FormSelectField
        form={form}
        name='state_id'
        numeric
        label={t('address.state')}
        options={opts((lookups?.states ?? []).filter((s) => s.parent_id === country))}
      />
      <FormSelectField
        form={form}
        name='city_id'
        numeric
        label={t('address.city')}
        options={opts((lookups?.cities ?? []).filter((c) => c.parent_id === state))}
      />
    </>
  )
}
