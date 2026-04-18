import { removeCookie } from '@/lib/cookies'

/**
 * Remove cookies visible on `document.cookie` for test isolation.
 *
 * - No `filter`: remove every cookie.
 * - `string`: remove only names that **start with** that string (prefix).
 * - `RegExp`: remove only names where `filter.test(name)` is true.
 */
export function clearCookies(filter?: string | RegExp): void {
  if (typeof document === 'undefined') return

  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim()
    if (!name) continue

    const shouldRemove =
      filter === undefined
        ? true
        : typeof filter === 'string'
          ? name.startsWith(filter)
          : filter.test(name)

    if (shouldRemove) {
      removeCookie(name)
    }
  }
}
