type Bag = Record<string, unknown>

export const getPath = (source: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>((acc, key) => (acc === null || acc === undefined ? undefined : (acc as Bag)[key]), source)

/** Immutable deep set; numeric segments address array items (`utilityLinks.0.href`). */
export const setPath = <T>(source: T, path: string, value: unknown): T => {
  const [head, ...rest] = path.split('.')
  const base = (source ?? {}) as Bag
  const copy: Bag | unknown[] = Array.isArray(base) ? [...base] : { ...base }
  const bag = copy as Bag
  bag[head] = rest.length ? setPath(bag[head], rest.join('.'), value) : value
  return copy as T
}

/** `utilityLinks.2.label` becomes `utilityLinks.label` (translation key). */
export const keyOf = (path: string): string => path.replace(/\.\d+(?=\.|$)/g, '')

export const moveItem = <T>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length) return list
  const copy = [...list]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}
