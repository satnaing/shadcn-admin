export const MAP_PROVIDERS = ['osm', 'maptiler', 'google', 'yandex'] as const
export type MapProviderKey = (typeof MAP_PROVIDERS)[number]

/** Providers that need their own API key (OpenStreetMap needs none). */
export const KEY_FIELD = { maptiler: 'maptiler_key', google: 'google_api_key', yandex: 'yandex_key' } as const
export type KeyField = (typeof KEY_FIELD)[keyof typeof KEY_FIELD]
export const KEY_FIELDS: KeyField[] = ['google_api_key', 'maptiler_key', 'yandex_key']

/** The API returns non-empty keys as this mask; sending it back means "unchanged". */
export const SECRET_MASK = '********'

export interface MapSettings {
  enabled: boolean
  provider: MapProviderKey
  google_api_key: string
  maptiler_key: string
  yandex_key: string
}

/** Default map centre; both `null` = not set. */
export interface MapLocation {
  latitude: number | null
  longitude: number | null
}

export type MapProviderData = MapSettings & MapLocation
