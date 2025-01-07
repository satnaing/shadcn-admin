import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { z } from 'zod'
import { useDebounce } from '~/hooks/use-debounce'

// Define the types for queries, filters, pagination, and sorting
export const QuerySchema = z.object({
  title: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional().default(''),
  ),
})

export const FilterSchema = z.object({
  status: z.array(z.string()).optional().default([]),
  priority: z.array(z.string()).optional().default([]),
})

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
      .union([
        z.literal('10'),
        z.literal('20'),
        z.literal('30'),
        z.literal('40'),
        z.literal('50'),
      ])
      .optional()
      .default('20')
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
    return FilterSchema.parse({
      status: searchParams.getAll('status'),
      priority: searchParams.getAll('priority'),
    })
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
        for (const [key, value] of Object.entries(newPagination)) {
          if (value !== undefined) {
            prev.set(key, String(value))
          } else {
            prev.delete(key)
          }
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
