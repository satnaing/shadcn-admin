export type WithData<T> = {
  /** Contains API response */
  data: T
}

export type WithPagination<T> = {
  data: T
  links: LinksInterface
  meta: MetaInterface
}

interface LinksInterface {
  first: string
  last: string
  prev: string
  next: string
}

export interface MetaInterface {
  current_page: number
  from: number
  last_page: number
  links: LinkInterface[]
  path: string
  per_page: number
  to: number
  total: number
}

interface LinkInterface {
  url?: string
  label: string
  page?: number
  active: boolean
}

export type Locale = string

export interface NamedEntityInterface {
  id: number
  name: string
}
