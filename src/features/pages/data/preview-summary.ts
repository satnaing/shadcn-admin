const pick = (value: unknown, lang: string): string | null => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const text = (value as Record<string, unknown>)[lang] ?? (value as Record<string, unknown>).az
    return typeof text === 'string' ? text : null
  }
  return null
}

/** Up to `limit` readable `key: value` lines of a section payload (localized values use `lang`, then `az`). */
export function payloadSummary(payload: Record<string, unknown>, lang: string, limit = 4): string[] {
  return Object.entries(payload)
    .map(([key, value]) => [key, pick(value, lang)] as const)
    .filter((entry): entry is readonly [string, string] => !!entry[1])
    .slice(0, limit)
    .map(([key, text]) => `${key}: ${text}`)
}
