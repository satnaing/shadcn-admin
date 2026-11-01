export interface ListQueryParams {
  page?: number
  per_page?: number
  sort?: string
  order?: string
  status?: string
  page_key?: string
  /** Free-text search across the columns the module marks as searchable. */
  search?: string
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
