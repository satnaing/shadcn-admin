import { tasks as initialTasks } from '../_shared/data/tasks'

interface ListFilteredTasksArgs {
  title: string
  filters: Record<string, string[]>
  currentPage: number
  pageSize: number
}

export const listFilteredTasks = ({
  title,
  filters,
  currentPage,
  pageSize,
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

  const totalPages = Math.ceil(tasks.length / pageSize)
  const totalItems = tasks.length

  return {
    data: tasks.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    pagination: {
      currentPage,
      pageSize,
      totalPages,
      totalItems,
    },
  }
}

interface GetFacetedCountsArgs {
  title: string
  facets: string[]
  filters: Record<string, string[]>
}
export const getFacetedCounts = ({
  title,
  facets,
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
