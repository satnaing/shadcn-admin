export type Query = Record<string, string>
/** `body` = parsed JSON request body (or FormData for uploads); only writes carry one. */
export type Handler = (ctx: { params: string[]; query: Query; body?: unknown }) => unknown

const PER_PAGE = 10

/** Server-side paging/sort/search over a fixture. Body shape: `{ data: T[], links, meta }`. */
export function paginate<T extends Record<string, unknown>>(rows: T[]): Handler {
  return ({ query }) => {
    const page = Number(query.page ?? 1)
    const perPage = Number(query.per_page ?? PER_PAGE)
    const search = (query.search ?? '').toLowerCase()
    const sort = query.sort ?? 'id'
    const order = query.order ?? 'desc'

    let data = search
      ? rows.filter((row) =>
          Object.values(row).some((value) => String(value).toLowerCase().includes(search))
        )
      : rows

    data = [...data].sort((a, b) => {
      const left = String(a[sort] ?? '')
      const right = String(b[sort] ?? '')
      return order === 'asc' ? left.localeCompare(right) : right.localeCompare(left)
    })

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

/** Detail body `{ data: row }`; first row when the id is unknown. */
export function single<T extends { id: number | string }>(rows: T[]): Handler {
  return ({ params }) => ({
    data: rows.find((row) => String(row.id) === params[0]) ?? rows[0],
  })
}

export function ok(payload: unknown = { message: 'ok' }): Handler {
  return () => payload
}
