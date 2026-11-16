import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import type { GatewayField } from '../data/otp.gateways'
import type { GatewayFormValues } from '../data/otp.schema'

/** One credential: a select for fixed choices, otherwise a text (or password) input. */
export function OtpGatewayField({ form, field }: { form: UseFormReturn<GatewayFormValues>; field: GatewayField }) {
  const { t } = useTranslation('otp')
  const label = t(`gateways.fields.${field.name}`)
  const hint = field.hint ? t(`gateways.hints.${field.name}`) : undefined

  if (field.options) {
    return (
      <FormSelectField
        form={form}
        name={field.name}
        label={label}
        options={field.options.map((o) => ({ value: o, label: t(`gateways.options.${field.name}.${o}`) }))}
      />
    )
  }

  return <FormInputField form={form} name={field.name} label={label} hint={hint} type={field.secret ? 'password' : 'text'} />
}
