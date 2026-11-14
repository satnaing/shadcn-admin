/**
 * Laravel JSON-u `0/1`, `"12.50"` kimi dəyərlər qaytarır — adapterlər eyni
 * çevirmələri təkrar yazmasın deyə burada bir yerdə saxlanılır.
 */
export function toBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') return value === '1' || value === 'true'
  return false
}

export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

export function toText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return fallback
}

export function toNullableText(value: unknown): string | null {
  const text = toText(value, '')
  return text === '' ? null : text
}
