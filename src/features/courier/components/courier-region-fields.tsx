import { useEffect } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormSelectField } from '@/components/forms/form-select-field'
import type { CourierFormValues } from '../data/courier.schema'
import type { LookupOption } from '../data/courier.type'
import { useCourierLookups } from '../hooks/use-courier'

const opts = (list: LookupOption[]) =>
  list.map((o) => ({ value: String(o.id), label: o.name }))

/** Country → state → city: each level lists only the children of the level above and resets when it changes. */
export function CourierRegionFields({
  form,
}: {
  form: UseFormReturn<CourierFormValues>
}) {
  const { t } = useTranslation('courier')
  const lookups = useCourierLookups().data?.data
  const [country, state] = form.watch(['country_id', 'state_id'])
  const states = (lookups?.states ?? []).filter((s) => s.parent_id === country)
  const cities = (lookups?.cities ?? []).filter((c) => c.parent_id === state)

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
        label={t('form.country')}
        options={opts(lookups?.countries ?? [])}
      />
      <FormSelectField
        form={form}
        name='state_id'
        numeric
        label={t('form.state')}
        options={opts(states)}
      />
      <FormSelectField
        form={form}
        name='city_id'
        numeric
        label={t('form.city')}
        options={opts(cities)}
      />
    </>
  )
}
