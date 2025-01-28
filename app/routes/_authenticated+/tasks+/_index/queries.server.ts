import type { Task } from '../_shared/data/schema'
import { tasks as initialTasks } from '../_shared/data/tasks'
import type { FILTER_FIELDS, Search } from './config'

const matchesSearch = (task: Task, search: Search) => {
  const searchTerms = Object.values(search)
    .filter(Boolean)
    .map((value) => value.toLowerCase())
  if (searchTerms.length === 0) return true
  const taskString = Object.values(task)
    .map((value) => String(value).toLowerCase())
    .join(' ')

  return searchTerms.every((term) => taskString.includes(term))
}

interface ListFilteredTasksArgs {
  search: Search
  filters: Record<string, string[]>
  page: number
  perPage: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const listFilteredTasks = ({
  search,
  filters,
  page,
  perPage,
  sortBy,
  sortOrder,
}: ListFilteredTasksArgs) => {
  const tasks = initialTasks
    .filter((task) => matchesSearch(task, search))
    .filter((task) => {
      // Filter by other filters
      return Object.entries(filters).every(([key, value]) => {
        if (value.length === 0) return true
        return value.includes((task as unknown as Record<string, string>)[key])
      })
    })
    .sort((a, b) => {
      if (!sortBy) return 0

      const aValue = (a as Record<string, unknown>)[sortBy]
      const bValue = (b as Record<string, unknown>)[sortBy]

      // Validate field existence
      if (aValue === undefined || bValue === undefined) return 0

      // Handle different types appropriately
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }

      // Convert to string for string comparison
      const aStr = String(aValue)
      const bStr = String(bValue)

      if (sortOrder === 'asc') {
        return aStr.localeCompare(bStr)
      }
      return bStr.localeCompare(aStr)
    })

  const totalPages = Math.ceil(tasks.length / perPage)
  const totalItems = tasks.length
  const newCurrentPage = Math.min(page, totalPages)

  return {
    data: tasks.slice((newCurrentPage - 1) * perPage, newCurrentPage * perPage),
    pagination: {
      page,
      perPage,
      totalPages,
      totalItems,
    },
  }
}

interface GetFacetedCountsArgs {
  facets: typeof FILTER_FIELDS
  search: Search
  filters: Record<string, string[]>
}
export const getFacetedCounts = ({
  facets,
  search,
  filters,
}: GetFacetedCountsArgs) => {
  const facetedCounts: Record<string, Record<string, number>> = {}

  // For each facet, filter the tasks based on the filters and count the occurrences
  for (const facet of facets) {
    // Filter the tasks based on the filters
    const filteredTasks = initialTasks
      .filter((task) => matchesSearch(task, search))
      // Filter by other filters
      .filter((task) => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === facet || value.length === 0) return true
          return value.includes((task as Record<string, string>)[key])
        })
      })

    // Count the occurrences of each facet value
    facetedCounts[facet] = filteredTasks.reduce(
      (acc, task) => {
        acc[(task as Record<string, string>)[facet]] =
          (acc[(task as Record<string, string>)[facet]] ?? 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  return facetedCounts
}
