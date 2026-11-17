import { lazy, Suspense, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { mapProviderApi } from '@/api/modules/map-provider.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { GeocodeResult, LatLng } from './map.logic'

// Leaflet touches `window` on import: load it in the browser only, and only when a picker is shown.
const Canvas = lazy(() => import('./map-picker-canvas'))

export interface MapPickerProps {
  value: LatLng | null
  onChange: (point: LatLng) => void
  disabled?: boolean
}

/** Pick a point: search an address (geocode), click the map or drag the marker. Tiles follow the map-provider settings. */
export function MapPicker({ value, onChange, disabled }: MapPickerProps) {
  const { t } = useTranslation('common')
  const [q, setQ] = useState('')
  const search = useDebouncedValue(q)
  const { data: settings } = useQuery({ queryKey: ['map-provider', 'tiles'], queryFn: () => mapProviderApi.get() })
  const { data: results = [] } = useQuery({
    queryKey: ['map-provider', 'geocode', search],
    queryFn: async () => (await mapProviderApi.geocode(search.trim())).data,
    enabled: search.trim().length >= 3,
  })
  const pick = (r: GeocodeResult) => {
    onChange({ lat: r.lat, lng: r.lng })
    setQ('')
  }

  return (
    <div className='space-y-2'>
      {!disabled && (
        <div className='relative'>
          <Search className='pointer-events-none absolute start-2.5 top-2.5 size-4 text-muted-foreground' />
          <Input className='ps-8' value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('mapPicker.search')} aria-label={t('mapPicker.search')} />
          {q.trim().length >= 3 && (
            <ul className='absolute z-[1000] mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover shadow'>
              {results.length === 0 && <li className='p-2 text-sm text-muted-foreground'>{t('mapPicker.noResults')}</li>}
              {results.map((r) => (
                <li key={`${r.lat},${r.lng}`}>
                  <Button type='button' variant='ghost' className='h-auto w-full justify-start whitespace-normal py-1.5 text-start' onClick={() => pick(r)}>
                    {r.label}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <Suspense fallback={<Skeleton className='h-64 w-full' />}>
        <Canvas
          value={value}
          onChange={onChange}
          provider={settings?.data.provider}
          tileKey={settings?.data.maptiler_key}
          disabled={disabled}
        />
      </Suspense>
      <p className='text-xs text-muted-foreground'>{value ? `${value.lat}, ${value.lng}` : t('mapPicker.hint')}</p>
    </div>
  )
}
