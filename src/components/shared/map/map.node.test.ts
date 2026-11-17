import { describe, expect, it } from 'vitest'
import { isValidLatLng, parseLatLng, roundLatLng, tileLayerFor } from './map.logic'

describe('map logic', () => {
  it('validates ranges', () => {
    expect(isValidLatLng({ lat: 40.4, lng: 49.8 })).toBe(true)
    expect(isValidLatLng({ lat: 95, lng: 0 })).toBe(false)
    expect(isValidLatLng({ lat: 0, lng: 181 })).toBe(false)
    expect(isValidLatLng(null)).toBe(false)
  })
  it('parses typed coordinates', () => {
    expect(parseLatLng('40.4093', '49.8671')).toEqual({ lat: 40.4093, lng: 49.8671 })
    expect(parseLatLng('', '49')).toBeNull()
    expect(parseLatLng('abc', '49')).toBeNull()
    expect(parseLatLng(null, null)).toBeNull()
    expect(parseLatLng(41, 50)).toEqual({ lat: 41, lng: 50 })
  })
  it('rounds to 5 decimals', () => {
    expect(roundLatLng({ lat: 40.123456789, lng: 49.987654321 })).toEqual({ lat: 40.12346, lng: 49.98765 })
  })
  it('uses OSM unless MapTiler has a real key', () => {
    expect(tileLayerFor('osm').url).toContain('openstreetmap')
    expect(tileLayerFor('google', 'AIza').url).toContain('openstreetmap')
    expect(tileLayerFor('maptiler', '********').url).toContain('openstreetmap')
    expect(tileLayerFor('maptiler', 'abc').url).toContain('maptiler.com')
  })
})
