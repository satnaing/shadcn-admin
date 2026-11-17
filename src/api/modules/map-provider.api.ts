import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiResponse } from '@/api/types'
import type { GeocodeResult } from '@/components/shared/map/map.logic'
import type { MapLocation, MapProviderData, MapSettings } from '@/features/map-provider/data/map-provider.type'

const E = ENDPOINTS.MAP_PROVIDER

export const mapProviderApi = {
  get: () => api.get<ApiResponse<MapProviderData>>(E.SETTINGS),
  saveSettings: (values: MapSettings) => api.put<ApiMessageResponse>(E.SETTINGS, values),
  saveLocation: (values: MapLocation) => api.put<ApiMessageResponse>(E.LOCATION, values),
  geocode: (q: string) => api.get<ApiResponse<GeocodeResult[]>>(`${E.GEOCODE}?q=${encodeURIComponent(q)}`),
}
