import { users as initialUsers } from '../_shared/data/users'

interface ListFilteredUsersArgs {
  username: string
  filters: Record<string, string[]>
  currentPage: number
  pageSize: number
  sortBy?: string
  sortOrder: 'asc' | 'desc'
}

export const listFilteredUsers = ({
  username,
  filters,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
}: ListFilteredUsersArgs) => {
  const users = initialUsers
    .filter((user) => {
      // Filter by title
      return user.username.toLowerCase().includes(username.toLowerCase())
    })
    .filter((user) => {
      // Filter by other filters
      return Object.entries(filters).every(([key, value]) => {
        if (value.length === 0) return true
        return value.includes((user as unknown as Record<string, string>)[key])
      })
    })
    .sort((a, b) => {
      if (!sortBy) return 0

      const aValue = a[sortBy as keyof typeof a]
      const bValue = b[sortBy as keyof typeof b]

      if (typeof aValue !== 'string' || typeof bValue !== 'string') {
        console.warn(`Invalid sort field type for ${sortBy}`)
        return 0
      }

      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

  const totalPages = Math.ceil(users.length / pageSize)
  const totalItems = users.length
  const newCurrentPage = Math.min(currentPage, totalPages)

  return {
    data: users.slice(
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
  username: string
  filters: Record<string, string[]>
}
export const getFacetedCounts = ({
  facets,
  username,
  filters,
}: GetFacetedCountsArgs) => {
  const facetedCounts: Record<string, Record<string, number>> = {}

  // For each facet, filter the tasks based on the filters and count the occurrences
  for (const facet of facets) {
    // Filter the users based on the filters
    const filteredUsers = initialUsers
      .filter((user) => {
        // Filter by title
        return user.username.toLowerCase().includes(username.toLowerCase())
      })
      // Filter by other filters
      .filter((user) => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === facet || value.length === 0) return true
          return value.includes(
            (user as unknown as Record<string, string>)[key],
          )
        })
      })

    // Count the occurrences of each facet value
    facetedCounts[facet] = filteredUsers.reduce(
      (acc, user) => {
        acc[(user as unknown as Record<string, string>)[facet]] =
          (acc[(user as unknown as Record<string, string>)[facet]] ?? 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  return facetedCounts
}
