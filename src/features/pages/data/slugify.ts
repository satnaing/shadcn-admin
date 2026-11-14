const MAP: Record<string, string> = { ə: 'e', ı: 'i', ö: 'o', ü: 'u', ç: 'c', ş: 's', ğ: 'g', İ: 'i' }

/** Latin slug; Azerbaijani/Turkish letters are transliterated, the rest is dashed. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[əıöüçşğİ]/g, (ch) => MAP[ch] ?? ch)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
