import { z } from 'zod'
import { KEY_FIELD, MAP_PROVIDERS } from './map-provider.type'

const required = 'map_provider:validation.required'
const key = z.string().trim().max(255, 'map_provider:validation.max255')

/** AEC saved whatever was typed; here the provider that is switched on must have its key (OpenStreetMap needs none). */
export const settingsSchema = z
  .object({
    enabled: z.boolean(),
    provider: z.enum(MAP_PROVIDERS),
    google_api_key: key,
    maptiler_key: key,
    yandex_key: key,
  })
  .superRefine((v, ctx) => {
    if (!v.enabled || v.provider === 'osm') return
    const field = KEY_FIELD[v.provider]
    if (v[field] === '') ctx.addIssue({ code: 'custom', path: [field], message: required })
  })
export type SettingsFormValues = z.infer<typeof settingsSchema>

const coordinate = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || (Number.isFinite(Number(v)) && Number(v) >= min && Number(v) <= max), message)

/** Both coordinates or none (AEC saved readonly text with no check). */
export const locationSchema = z
  .object({
    latitude: coordinate(-90, 90, 'map_provider:validation.latitude'),
    longitude: coordinate(-180, 180, 'map_provider:validation.longitude'),
  })
  .superRefine((v, ctx) => {
    if ((v.latitude === '') !== (v.longitude === '')) {
      ctx.addIssue({ code: 'custom', path: [v.latitude === '' ? 'latitude' : 'longitude'], message: required })
    }
  })
export type LocationFormValues = z.infer<typeof locationSchema>

export const toCoordinate = (v: string): number | null => (v.trim() === '' ? null : Number(v))
