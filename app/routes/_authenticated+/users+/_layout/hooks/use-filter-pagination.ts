import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { z } from 'zod'
import { useDebounce } from '~/hooks/use-debounce'

// Define the types for filters and pagination
export const QuerySchema = z.object({
  username: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional().default(''),
  ),
})

export const FilterSchema = z.object({
  status: z.array(z.string()).optional().default([]),
  role: z.array(z.string()).optional().default([]),
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
export type Pagination = z.infer<typeof PaginationSchema>

export function useFilterPagination() {
  const [searchParams, setSearchParams] = useSearchParams()
  const debounce = useDebounce(200)

  const queries: Queries = useMemo(() => {
    return QuerySchema.parse({
      username: searchParams.get('username'),
    })
  }, [searchParams])

  const filters: Filters = useMemo(() => {
    return FilterSchema.parse({
      status: searchParams.getAll('status'),
      role: searchParams.getAll('role'),
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
          console.log({ newQueries })
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
    pagination,
    updateQueries,
    updateFilters,
    updatePagination,
    isFiltered,
    resetFilters,
  }
}
