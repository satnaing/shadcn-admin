import { users } from '@/features/users/data/users'
import { http, HttpResponse } from 'msw'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const handlers = [
  http.get(`${API_BASE_URL}/users`, ({ request }) => {
    const url = new URL(request.url)

    // Extract query parameters
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const statusFilter = url.searchParams.get('status')?.split(',') || []
    const roleFilter = url.searchParams.get('role')?.split(',') || []
    const usernameFilter = url.searchParams.get('username') || ''

    // Filter users based on query parameters
    let filteredUsers = users

    // Filter by status
    if (statusFilter.length > 0) {
      filteredUsers = filteredUsers.filter((user) =>
        statusFilter.includes(user.status)
      )
    }

    // Filter by role
    if (roleFilter.length > 0) {
      filteredUsers = filteredUsers.filter((user) =>
        roleFilter.includes(user.role)
      )
    }

    // Filter by username (case-insensitive partial match)
    if (usernameFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.username.toLowerCase().includes(usernameFilter.toLowerCase())
      )
    }

    // Calculate pagination
    const totalUsers = filteredUsers.length
    const totalPages = Math.ceil(totalUsers / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(
        () => {
          resolve(
            HttpResponse.json({
              data: paginatedUsers,
              pagination: {
                page,
                pageSize,
                total: totalUsers,
                totalPages,
              },
            })
          )
        },
        // up to 1 second delay
        Math.random() * 800 + 200
      )
    })
  }),
]
