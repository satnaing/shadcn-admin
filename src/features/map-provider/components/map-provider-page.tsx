import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { useMapProvider } from '../hooks/use-map-provider'
import { MapProviderLocationCard } from './map-provider-location-card'
import { MapProviderSettingsCard } from './map-provider-settings-card'

/** AEC "Map Setting" page: provider settings, and the default location while the map is switched on. */
export function MapProviderPage() {
  const { t } = useTranslation('map_provider')
  const data = useMapProvider().data?.data

  return (
    <AdminPageShell title={t('title')} description={t('description')}>
      {data ? (
        <div className='grid max-w-3xl gap-6'>
          {/* keyed by their own stored values: saving one card must not wipe unsaved edits in the other */}
          <MapProviderSettingsCard
            key={[data.enabled, data.provider, data.google_api_key, data.maptiler_key, data.yandex_key].join('|')}
            settings={data}
          />
          {data.enabled && <MapProviderLocationCard key={`${data.latitude}/${data.longitude}`} location={data} />}
        </div>
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
