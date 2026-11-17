import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { MapPicker } from '@/components/shared/map/map-picker'
import { parseLatLng, roundLatLng } from '@/components/shared/map/map.logic'
import { type PickupFormValues, pickupSchema } from '../data/courier.schema'
import type { CourierSettings } from '../data/courier.type'
import { useCourierMutations } from '../hooks/use-courier-mutations'
import { CourierFormCard } from './courier-form-card'

/** Where couriers collect parcels. AEC shows a Google map when it is enabled; until the map module exists the coordinates are typed. */
export function CourierPickupCard({ settings }: { settings: CourierSettings }) {
  const { t } = useTranslation('courier')
  const { saveSettings } = useCourierMutations()
  const form = useForm<PickupFormValues>({
    resolver: zodResolver(pickupSchema),
    defaultValues: {
      pickup_latitude: settings.pickup_latitude,
      pickup_longitude: settings.pickup_longitude,
    },
  })

  const [lat, lng] = useWatch({ control: form.control, name: ['pickup_latitude', 'pickup_longitude'] })

  return (
    <CourierFormCard
      form={form}
      title={t('config.pickupTitle')}
      description={t('config.pickupDescription')}
      permission={PERMISSIONS.COURIER.CONFIG_MANAGE}
      pending={saveSettings.isPending}
      onSubmit={(v) => saveSettings.mutate(v)}
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormInputField
          form={form}
          name='pickup_latitude'
          label={t('config.latitude')}
        />
        <FormInputField
          form={form}
          name='pickup_longitude'
          label={t('config.longitude')}
        />
      </div>
      <MapPicker
        value={parseLatLng(lat, lng)}
        onChange={(p) => {
          const r = roundLatLng(p)
          form.setValue('pickup_latitude', String(r.lat), { shouldDirty: true })
          form.setValue('pickup_longitude', String(r.lng), { shouldDirty: true })
        }}
      />
    </CourierFormCard>
  )
}
