import { tasks as initialTasks } from '../_shared/data/tasks'

interface ListFilteredTasksArgs {
  title: string
  filters: Record<string, string[]>
  currentPage: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const listFilteredTasks = ({
  title,
  filters,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
}: ListFilteredTasksArgs) => {
  const tasks = initialTasks
    .filter((task) => {
      // Filter by title
      return task.title.toLowerCase().includes(title.toLowerCase())
    })
    .filter((task) => {
      // Filter by other filters
      return Object.entries(filters).every(([key, value]) => {
        if (value.length === 0) return true
        return value.includes((task as unknown as Record<string, string>)[key])
      })
    })
    .sort((a, b) => {
      if (!sortBy) return 0
      if (sortOrder === 'asc') {
        return (a as Record<string, string>)[sortBy].localeCompare(
          (b as Record<string, string>)[sortBy],
        )
      }
      return (b as Record<string, string>)[sortBy].localeCompare(
        (a as Record<string, string>)[sortBy],
      )
    })

  const totalPages = Math.ceil(tasks.length / pageSize)
  const totalItems = tasks.length
  const newCurrentPage = Math.min(currentPage, totalPages)

  return {
    data: tasks.slice(
      (newCurrentPage - 1) * pageSize,
      newCurrentPage * pageSize,
    ),
    pagination: {
      currentPage: newCurrentPage,
      pageSize,
      totalPages,
      totalItems,
    },
  }
}

interface GetFacetedCountsArgs {
  facets: string[]
  title: string
  filters: Record<string, string[]>
}
export const getFacetedCounts = ({
  facets,
  title,
  filters,
}: GetFacetedCountsArgs) => {
  const facetedCounts: Record<string, Record<string, number>> = {}

  // For each facet, filter the tasks based on the filters and count the occurrences
  for (const facet of facets) {
    // Filter the tasks based on the filters
    const filteredTasks = initialTasks
      .filter((task) => {
        // Filter by title
        return task.title.toLowerCase().includes(title.toLowerCase())
      })
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
