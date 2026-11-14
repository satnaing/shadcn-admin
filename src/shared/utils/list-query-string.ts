export interface ListQueryParams {
  page?: number
  per_page?: number
  sort?: string
  order?: string
  status?: string
  page_key?: string
  /** Free-text search across the columns the module marks as searchable. */
  search?: string
  q?: string
  /** Module-specific filters (e.g. a unit `type`). */
  [key: string]: string | number | undefined
}

export function buildListQueryString(params: ListQueryParams): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue
    }

    search.set(key, String(value))
  }

  return search.toString()
}

const asString = (value: unknown) => (typeof value === 'string' && value ? value : undefined)

/**
 * Table URL state → server list params: `?q=&page=&per_page=&sort=` (`sort=-field` is descending)
 * plus the named filter keys. The server does all searching, sorting and paging.
 */
export function toServerListParams(
  search: Record<string, unknown>,
  options: { defaultSort?: string; defaultOrder?: 'asc' | 'desc'; filters?: string[] } = {}
): ListQueryParams {
  const field = asString(search.sort) ?? options.defaultSort ?? 'id'
  const order = asString(search.order) ?? options.defaultOrder ?? 'desc'

  return {
    q: asString(search.q),
    page: typeof search.page === 'number' ? search.page : 1,
    per_page: typeof search.pageSize === 'number' ? search.pageSize : 10,
    sort: order === 'desc' ? `-${field}` : field,
    ...Object.fromEntries((options.filters ?? []).map((key) => [key, asString(search[key])])),
  }
}
