import { KEY_FIELDS, type MapSettings, SECRET_MASK } from './map-provider.type'

/** API contract (the mock follows it): non-empty keys leave the server masked. */
export function maskKeys(settings: MapSettings): MapSettings {
  const out = { ...settings }
  for (const f of KEY_FIELDS) if (out[f]) out[f] = SECRET_MASK
  return out
}

/** Incoming keys equal to the mask mean "unchanged". */
export function mergeKeys(stored: MapSettings, incoming: MapSettings): MapSettings {
  const out = { ...incoming }
  for (const f of KEY_FIELDS) if (out[f] === SECRET_MASK) out[f] = stored[f]
  return out
}
