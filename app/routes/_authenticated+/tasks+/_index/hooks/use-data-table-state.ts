import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { z } from 'zod'
import { useDebounce } from '~/hooks/use-debounce'
import {
  FILTER_FIELDS,
  PAGINATION_PER_PAGE_DEFAULT,
  PAGINATION_PER_PAGE_ITEMS,
} from '../config'

// Define the types for queries, filters, pagination, and sorting
export const QuerySchema = z.object({
  title: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional().default(''),
  ),
})

export const FilterSchema = z.object(
  FILTER_FIELDS.reduce(
    (acc, field) => {
      acc[field] = z.array(z.string()).optional().default([])
      return acc
    },
    {} as Record<
      (typeof FILTER_FIELDS)[number],
      z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>>
    >,
  ),
)

export const SortSchema = z.object({
  sort_by: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional(),
  ),
  sort_order: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .union([z.literal('asc'), z.literal('desc')])
      .optional()
      .default('asc'),
  ),
})

export const PaginationSchema = z.object({
  page: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional().default('1').transform(Number),
  ),
  per_page: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .enum(PAGINATION_PER_PAGE_ITEMS)
      .optional()
      .default(PAGINATION_PER_PAGE_DEFAULT)
      .transform(Number),
  ),
})

export type Queries = z.infer<typeof QuerySchema>
export type Filters = z.infer<typeof FilterSchema>
export type Sort = z.infer<typeof SortSchema>
export type Pagination = z.infer<typeof PaginationSchema>

export function useDataTableState() {
  const [searchParams, setSearchParams] = useSearchParams()
  const debounce = useDebounce(200)

  const queries: Queries = useMemo(() => {
    return QuerySchema.parse({
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

  const updateQueries = (newQueries: Partial<Queries>) => {
    debounce(() => {
      setSearchParams(
        (prev) => {
          for (const [key, value] of Object.entries(newQueries)) {
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
    Object.values(queries).some((query) => query !== '')

  const resetFilters = () => {
    setSearchParams({}, { preventScrollReset: true })
  }

  return {
    queries,
    filters,
    sort,
    pagination,
    updateQueries,
    updateFilters,
    updateSort,
    updatePagination,
    isFiltered,
    resetFilters,
  }
}
