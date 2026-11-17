/**
 * Dev-only persistence of mock collections so a hard reload keeps the writes.
 * Collections are keyed by creation order (module import order is stable in dev);
 * `?mockReset=1` drops the saved state. Off in tests and production builds.
 */
const PREFIX = 'admin2-mock:'
const registry: Array<{ key: string; rows: unknown[] }> = []

const enabled = () => {
  if (!import.meta.env.DEV || import.meta.env.MODE === 'test') return false
  try {
    return typeof sessionStorage !== 'undefined' && typeof window !== 'undefined'
  } catch {
    return false
  }
}

let ready = false
function init() {
  ready = true
  const reset = new URLSearchParams(window.location.search).has('mockReset')
  if (reset) {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => sessionStorage.removeItem(k))
  }
  window.addEventListener('pagehide', () => {
    for (const { key, rows } of registry) {
      try {
        sessionStorage.setItem(key, JSON.stringify(rows))
      } catch {
        /* quota: keep the seed on next load */
      }
    }
  })
}

/** Restores saved rows into `rows` (in place) and registers it for saving; returns true when restored. */
export function persistCollection<T>(rows: T[]): boolean {
  if (!enabled()) return false
  if (!ready) init()
  const key = `${PREFIX}${registry.length}`
  registry.push({ key, rows })
  try {
    const saved = sessionStorage.getItem(key)
    if (!saved) return false
    rows.splice(0, rows.length, ...(JSON.parse(saved) as T[]))
    return true
  } catch {
    return false
  }
}
