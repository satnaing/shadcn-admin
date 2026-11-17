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

const PLACES = [
  ['Bakı, Azərbaycan', 40.4093, 49.8671], ['Bakı, Nərimanov rayonu', 40.4092, 49.8671], ['Bakı, Nizami küçəsi', 40.3777, 49.8492],
  ['Gəncə, Azərbaycan', 40.6828, 46.3606], ['Sumqayıt, Azərbaycan', 40.5855, 49.6317], ['Şəki, Azərbaycan', 41.1919, 47.1706],
  ['Lənkəran, Azərbaycan', 38.7529, 48.8475], ['Naxçıvan, Azərbaycan', 39.2089, 45.4122], ['Mingəçevir, Azərbaycan', 40.7703, 47.0496],
] as const
const P = '/admin/map-provider'
const body = <T>(b: unknown) => (b ?? {}) as T

const routes: Record<string, Handler> = {
  [`GET ${P}/settings`]: () => ({ data: { ...maskKeys(settings), ...location } }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = mergeKeys(settings, body<MapSettings>(b))
    return { message: 'ok' }
  },
  [`GET ${P}/geocode`]: ({ query }) => ({
    data: PLACES.filter(([label]) => label.toLowerCase().includes((query.q ?? '').toLowerCase())).map(([label, lat, lng]) => ({ label, lat, lng })),
  }),
  [`PUT ${P}/location`]: ({ body: b }) => {
    location = body<MapLocation>(b)
    return { message: 'ok' }
  },
}

export default routes
