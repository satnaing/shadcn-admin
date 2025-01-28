import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useDebounce } from '~/hooks/use-debounce'
import {
  FILTER_FIELDS,
  FilterSchema,
  PAGINATION_PER_PAGE_DEFAULT,
  PaginationSchema,
  SearchSchema,
  SortSchema,
  type Filters,
  type Pagination,
  type Search,
  type Sort,
} from '../config'

export function useDataTableState() {
  const [searchParams, setSearchParams] = useSearchParams()
  const debounce = useDebounce(200)

  const search: Search = useMemo(() => {
    return SearchSchema.parse({
      title: searchParams.get('title'),
    })
  }, [searchParams])

  const filters: Filters = useMemo(() => {
    return FilterSchema.parse(
      Object.fromEntries(
        FILTER_FIELDS.map((field) => [field, searchParams.getAll(field)]),
      ),
    )
  }, [searchParams])

  const sort: Sort = useMemo(() => {
    return SortSchema.parse({
      sort_by: searchParams.get('sort_by'),
      sort_order: searchParams.get('sort_order') as 'asc' | 'desc' | null,
    })
  }, [searchParams])

  const pagination: Pagination = useMemo(() => {
    return PaginationSchema.parse({
      page: searchParams.get('page'),
      per_page: searchParams.get('per_page'),
    })
  }, [searchParams])

  const updateSearch = (newSearch: Partial<Search>) => {
    debounce(() => {
      setSearchParams(
        (prev) => {
          for (const [key, value] of Object.entries(newSearch)) {
            if (value === undefined || value === '') {
              prev.delete(key)
            } else {
              prev.set(key, value)
            }
          }
          return prev
        },
        { preventScrollReset: true },
      )
    })
    updatePagination({ page: undefined })
  }

  const updateFilters = (newFilters: Partial<Filters>) => {
    setSearchParams(
      (prev) => {
        for (const [key, value] of Object.entries(newFilters)) {
          if (Array.isArray(value)) {
            prev.delete(key)
            for (const v of value) {
              prev.append(key, v)
            }
          } else if (value !== undefined) {
            prev.set(key, value)
          } else {
            prev.delete(key)
          }
        }
        return prev
      },
      { preventScrollReset: true },
    )
    updatePagination({ page: undefined })
  }

  const updateSort = (newSort: Partial<Sort>) => {
    setSearchParams(
      (prev) => {
        if (newSort.sort_by) {
          prev.set('sort_by', newSort.sort_by)
          prev.set('sort_order', newSort.sort_order || 'asc')
        } else {
          prev.delete('sort_by')
          prev.delete('sort_order')
        }
        return prev
      },
      { preventScrollReset: true },
    )
    updatePagination({ page: undefined })
  }

  const updatePagination = (newPagination: Partial<Pagination>) => {
    setSearchParams(
      (prev) => {
        if (newPagination.page === 1 || newPagination.page === undefined) {
          prev.delete('page')
        } else {
          prev.set('page', String(newPagination.page))
        }
        if (
          newPagination.per_page === Number(PAGINATION_PER_PAGE_DEFAULT) ||
          newPagination.per_page === undefined
        ) {
          prev.delete('per_page')
        } else {
          prev.set('per_page', String(newPagination.per_page))
        }
        return prev
      },
      { preventScrollReset: true },
    )
  }

  const isFiltered =
    Object.values(filters).some((filterArray) => filterArray.length > 0) ||
    Object.values(search).some((query) => query !== '')

  const resetFilters = () => {
    setSearchParams({}, { preventScrollReset: true })
  }

  return {
    search,
    filters,
    sort,
    pagination,
    updateSearch,
    updateFilters,
    updateSort,
    updatePagination,
    isFiltered,
    resetFilters,
  }
}
