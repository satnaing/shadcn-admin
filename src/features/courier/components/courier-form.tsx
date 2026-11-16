import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { EntityFormPage } from '@/components/forms/entity-form-page'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import {
  type CourierFormValues,
  courierDefaults,
  courierSchema,
} from '../data/courier.schema'
import type { CourierDetail } from '../data/courier.type'
import { useCourierMutations } from '../hooks/use-courier-mutations'
import { CourierRegionFields } from './courier-region-fields'

const toValues = (c: CourierDetail): CourierFormValues => ({
  name: c.name,
  email: c.email,
  phone: c.phone,
  password: '',
  country_id: c.country_id,
  state_id: c.state_id,
  city_id: c.city_id,
  avatar: c.avatar,
  address: c.address,
})

/** `courier` = loaded record when editing; `undefined` = create. Remount with `key`. */
export function CourierForm({ courier }: { courier?: CourierDetail }) {
  const { t } = useTranslation('courier')
  const navigate = useNavigate()
  const { create, update } = useCourierMutations()
  const form = useForm<CourierFormValues>({
    resolver: zodResolver(courierSchema(!courier)),
    defaultValues: courier ? toValues(courier) : courierDefaults,
  })
  const mutation = courier ? update : create

  const submit = form.handleSubmit((values) => {
    const onSuccess = () => navigate({ to: '/admin/courier' })
    if (courier) update.mutate({ id: courier.id, values }, { onSuccess })
    else create.mutate(values, { onSuccess })
  })

  return (
    <EntityFormPage
      backTo='/admin/courier'
      form={form}
      title={t(courier ? 'form.editTitle' : 'form.createTitle')}
      description={t('form.description')}
      isCreate={!courier}
      isPending={mutation.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.save'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.save'),
      }}
      onSubmit={submit}
    >
      <div className='grid gap-4 md:grid-cols-2'>
        <FormInputField form={form} name='name' label={t('form.name')} />
        <FormInputField
          form={form}
          name='email'
          type='email'
          label={t('form.email')}
        />
        <FormInputField form={form} name='phone' label={t('form.phone')} />
        <FormInputField
          form={form}
          name='password'
          type='password'
          label={t('form.password')}
          hint={courier ? t('form.passwordHint') : undefined}
        />
        <CourierRegionFields form={form} />
        <FormImageField form={form} name='avatar' label={t('form.avatar')} />
      </div>
      <FormTextareaField
        form={form}
        name='address'
        label={t('form.address')}
        rows={3}
      />
    </EntityFormPage>
  )
}
