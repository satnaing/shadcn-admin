import { maskKeys, mergeKeys } from '@/features/map-provider/data/map-provider.secrets'
import type { MapLocation, MapSettings } from '@/features/map-provider/data/map-provider.type'
import type { Handler } from './helpers'

let settings: MapSettings = {
  enabled: true,
  provider: 'osm',
  google_api_key: 'AIza-demo-google-key',
  maptiler_key: '',
  yandex_key: '',
}
let location: MapLocation = { latitude: 40.4093, longitude: 49.8671 }

const P = '/admin/map-provider'
const body = <T>(b: unknown) => (b ?? {}) as T

const routes: Record<string, Handler> = {
  [`GET ${P}/settings`]: () => ({ data: { ...maskKeys(settings), ...location } }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = mergeKeys(settings, body<MapSettings>(b))
    return { message: 'ok' }
  },
  [`PUT ${P}/location`]: ({ body: b }) => {
    location = body<MapLocation>(b)
    return { message: 'ok' }
  },
}

export default routes
