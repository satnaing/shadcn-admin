import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormCard } from '@/components/forms/form-card'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import { PERMISSIONS } from '@/shared/permissions'
import { type SettingsFormValues, settingsSchema } from '../data/map-provider.schema'
import { KEY_FIELD, MAP_PROVIDERS, type MapSettings } from '../data/map-provider.type'
import { useMapProviderMutations } from '../hooks/use-map-provider'

/** AEC "Map Setting": switch, provider and the key of the chosen provider (OpenStreetMap needs none). */
export function MapProviderSettingsCard({ settings }: { settings: MapSettings }) {
  const { t } = useTranslation('map_provider')
  const { saveSettings } = useMapProviderMutations()
  const form = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema), defaultValues: settings })
  const provider = useWatch({ control: form.control, name: 'provider' })
  const keyField = provider === 'osm' ? null : KEY_FIELD[provider]

  return (
    <FormCard
      form={form}
      title={t('settings.title')}
      description={t('settings.description')}
      permission={PERMISSIONS.MAP_PROVIDER.MANAGE}
      pending={saveSettings.isPending}
      labels={{ save: t('actions.save'), saving: t('actions.saving') }}
      onSubmit={(values) => saveSettings.mutate(values)}
    >
      <FormSwitchField form={form} name='enabled' label={t('settings.enabled')} hint={t('settings.enabledHint')} />
      <FormSelectField
        form={form}
        name='provider'
        label={t('settings.provider')}
        options={MAP_PROVIDERS.map((p) => ({ value: p, label: t(`providers.${p}`) }))}
      />
      {keyField ? (
        <FormInputField form={form} name={keyField} label={t(`settings.${keyField}`)} type='password' />
      ) : (
        <p className='text-sm text-muted-foreground'>{t('settings.osmNoKey')}</p>
      )}
    </FormCard>
  )
}
