import { tasks as initialTasks } from '../_shared/data/tasks'

export const listFilteredTasks = (
  filters: Record<string, string[]>,
  currentPage: number,
  pageSize: number,
) => {
  const tasks = initialTasks.filter((task) => {
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

export const getFacetedCounts = (
  facets: string[],
  filters: Record<string, string[]>,
) => {
  const facetedCounts: Record<string, Record<string, number>> = {}

  // For each facet, filter the tasks based on the filters and count the occurrences
  for (const facet of facets) {
    // Filter the tasks based on the filters
    const filteredTasks = initialTasks.filter((task) => {
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
