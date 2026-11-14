export function normalizeRecordTranslations<T extends Record<string, unknown>>(
  translations: unknown
): T {
  if (Array.isArray(translations)) {
    return {} as T
  }

  return translations as T
}
