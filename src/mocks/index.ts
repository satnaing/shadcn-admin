import { authMock } from './auth'
import { settingsMock } from './settings'

type Query = Record<string, string>
type Handler = (ctx: { params: string[]; query: Query }) => unknown

const PER_PAGE = 10

/** Server tərəfi səhifələmə/sıralama/axtarışı fixture üzərində təkrarlayır. */
export function paginate<T extends Record<string, unknown>>(rows: T[]): Handler {
  return ({ query }) => {
    const page = Number(query.page ?? 1)
    const perPage = Number(query.per_page ?? PER_PAGE)
    const search = (query.search ?? '').toLowerCase()
    const sort = query.sort ?? 'id'
    const order = query.order ?? 'desc'

    let data = search
      ? rows.filter((row) =>
          Object.values(row).some((value) =>
            String(value).toLowerCase().includes(search)
          )
        )
      : rows

    data = [...data].sort((a, b) => {
      const left = String(a[sort] ?? '')
      const right = String(b[sort] ?? '')
      return order === 'asc' ? left.localeCompare(right) : right.localeCompare(left)
    })

    const total = data.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const from = (page - 1) * perPage

    return {
      data: data.slice(from, from + perPage),
      links: { first: '', last: '', prev: '', next: '' },
      meta: {
        current_page: page,
        from: from + 1,
        last_page: lastPage,
        links: [],
        path: '',
        per_page: perPage,
        to: Math.min(from + perPage, total),
        total,
      },
    }
  }
}

export function single<T extends { id: number }>(rows: T[]): Handler {
  return ({ params }) => ({
    data: rows.find((row) => String(row.id) === params[0]) ?? rows[0],
  })
}

export function ok(payload: unknown = { message: 'ok' }): Handler {
  return () => payload
}

/**
 * `METHOD /yol` → cavab. `:param` bir seqmenti tutur.
 * Hər bölüm öz sətirlərini bura əlavə edir (bax: SECTION-PROMPT.md §3.4).
 */
export const mockRoutes: Record<string, Handler> = {
  'POST /auth/login': ok(authMock),
  'POST /auth/logout': ok(),
  'GET /me': ok({ data: authMock }),
  'GET /settings/public': ok({ data: settingsMock }),
}
