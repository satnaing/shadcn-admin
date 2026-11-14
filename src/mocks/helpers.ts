export type Query = Record<string, string>
/** `body` = parsed JSON request body (or FormData for uploads); only writes carry one. */
export type Handler = (ctx: { params: string[]; query: Query; body?: unknown }) => unknown

const PER_PAGE = 10

const leaves = (value: unknown): string[] =>
  value !== null && typeof value === 'object'
    ? Object.values(value).flatMap(leaves)
    : value === undefined || value === null
      ? []
      : [String(value)]

const compare = (a: unknown, b: unknown) =>
  typeof a === 'number' && typeof b === 'number' ? a - b : String(a ?? '').localeCompare(String(b ?? ''))

/**
 * Server-side paging/sort/search over a fixture. Query: `?q=&page=&per_page=&sort=` where
 * `sort=-field` is descending (legacy `search`/`order` still honoured). Body: `{ data: T[], links, meta }`.
 */
export function paginate<T extends Record<string, unknown>>(rows: T[] | (() => T[])): Handler {
  return ({ query }) => {
    const source = typeof rows === 'function' ? rows() : rows
    const page = Math.max(1, Number(query.page ?? 1))
    const perPage = Number(query.per_page ?? PER_PAGE)
    const needle = (query.q ?? query.search ?? '').trim().toLowerCase()
    const rawSort = query.sort ?? 'id'
    const field = rawSort.replace(/^-/, '')
    const desc = query.sort ? rawSort.startsWith('-') || query.order === 'desc' : query.order !== 'asc'

    let data = needle ? source.filter((row) => leaves(row).some((v) => v.toLowerCase().includes(needle))) : source
    data = [...data].sort((a, b) => (desc ? compare(b[field], a[field]) : compare(a[field], b[field])))

    const total = data.length
    const from = (page - 1) * perPage

    return {
      data: data.slice(from, from + perPage),
      links: { first: '', last: '', prev: '', next: '' },
      meta: {
        current_page: page,
        from: from + 1,
        last_page: Math.max(1, Math.ceil(total / perPage)),
        links: [],
        path: '',
        per_page: perPage,
        to: Math.min(from + perPage, total),
        total,
      },
    }
  }
}

/**
 * In-memory table: writes survive until the page reloads. `rows` is the live array, so a
 * handler that reads `all()` always sees the latest state.
 */
export function createCollection<T extends { id: number }>(seed: T[]) {
  const rows = seed.map((row) => ({ ...row }))
  let next = Math.max(0, ...rows.map((row) => row.id)) + 1
  const at = (id: string | number) => rows.findIndex((row) => String(row.id) === String(id))

  return {
    all: () => rows,
    get: (id: string | number) => rows[at(id)],
    create(data: Omit<T, 'id'>, position: 'start' | 'end' = 'end') {
      const row = { ...data, id: next++ } as T
      if (position === 'start') rows.unshift(row)
      else rows.push(row)
      return row
    },
    update(id: string | number, patch: Partial<T>) {
      const row = rows[at(id)]
      if (row) Object.assign(row, patch, { id: row.id })
      return row
    },
    remove(id: string | number) {
      const index = at(id)
      if (index >= 0) rows.splice(index, 1)
      return index >= 0
    },
    /** Rewrites row order to follow `ids`; unknown ids are ignored, unlisted rows keep their relative place at the end. */
    reorder(ids: Array<string | number>) {
      const rank = new Map(ids.map((id, i) => [String(id), i]))
      rows.sort((a, b) => (rank.get(String(a.id)) ?? ids.length) - (rank.get(String(b.id)) ?? ids.length))
    },
  }
}

/** Detail body `{ data: row }`; first row when the id is unknown. */
export function single<T extends { id: number | string }>(rows: T[]): Handler {
  return ({ params }) => ({
    data: rows.find((row) => String(row.id) === params[0]) ?? rows[0],
  })
}

export function ok(payload: unknown = { message: 'ok' }): Handler {
  return () => payload
}
