import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormCard } from '@/components/forms/form-card'
import { FormInputField } from '@/components/forms/form-input-field'
import { PERMISSIONS } from '@/shared/permissions'
import { type LocationFormValues, locationSchema, toCoordinate } from '../data/map-provider.schema'
import type { MapLocation } from '../data/map-provider.type'
import { useMapProviderMutations } from '../hooks/use-map-provider'

/** AEC "Default Location Setting": the centre every address picker opens on (empty = no default). */
export function MapProviderLocationCard({ location }: { location: MapLocation }) {
  const { t } = useTranslation('map_provider')
  const { saveLocation } = useMapProviderMutations()
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { latitude: String(location.latitude ?? ''), longitude: String(location.longitude ?? '') },
  })

  return (
    <FormCard
      form={form}
      title={t('location.title')}
      description={t('location.description')}
      permission={PERMISSIONS.MAP_PROVIDER.MANAGE}
      pending={saveLocation.isPending}
      labels={{ save: t('actions.save'), saving: t('actions.saving') }}
      onSubmit={(v) => saveLocation.mutate({ latitude: toCoordinate(v.latitude), longitude: toCoordinate(v.longitude) })}
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormInputField form={form} name='latitude' label={t('location.latitude')} placeholder='40.4093' />
        <FormInputField form={form} name='longitude' label={t('location.longitude')} placeholder='49.8671' />
      </div>
    </FormCard>
  )
}
