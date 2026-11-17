export interface LatLng {
  lat: number
  lng: number
}

export interface GeocodeResult extends LatLng {
  label: string
}

/** Baku — used when the form has no coordinates yet. */
export const DEFAULT_CENTER: LatLng = { lat: 40.4093, lng: 49.8671 }

export const isValidLatLng = (p: Partial<LatLng> | null | undefined): p is LatLng =>
  !!p && Number.isFinite(p.lat) && Number.isFinite(p.lng) && Math.abs(p.lat!) <= 90 && Math.abs(p.lng!) <= 180

/** Coordinates typed into text inputs (`''` = not set) → point, or null when empty/invalid. */
export const parseLatLng = (lat: string | number | null | undefined, lng: string | number | null | undefined): LatLng | null => {
  if (lat === '' || lng === '' || lat == null || lng == null) return null
  const p = { lat: Number(lat), lng: Number(lng) }
  return isValidLatLng(p) ? p : null
}

/** 5 decimals ≈ 1 m, enough for an address pin. */
export const roundLatLng = (p: LatLng): LatLng => ({ lat: Math.round(p.lat * 1e5) / 1e5, lng: Math.round(p.lng * 1e5) / 1e5 })

/**
 * Tile layer: OpenStreetMap unless MapTiler has a usable key. Google / Yandex tiles need their own SDKs, so those
 * providers (and a masked key such as `********`) also use OpenStreetMap.
 */
export function tileLayerFor(provider?: string, key?: string): { url: string; attribution: string } {
  if (provider === 'maptiler' && key && !/^\*+$/.test(key)) {
    return {
      url: `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${encodeURIComponent(key)}`,
      attribution: '© MapTiler © OpenStreetMap contributors',
    }
  }
  return { url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: '© OpenStreetMap contributors' }
}
