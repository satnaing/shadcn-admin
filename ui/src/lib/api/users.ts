/**
 * Users API service
 */
import { apiClient } from '@/lib/api-client'
import type { UserResponse } from '@/lib/api/auth'

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: int
  has_more: boolean
  total_pages: number
  current_page: number
}

export interface UsersListParams {
  skip?: number
  limit?: number
  search?: string
  role?: 'superadmin' | 'admin' | 'manager' | 'cashier'
  status?: 'active' | 'inactive' | 'invited' | 'suspended'
}

export interface UIUser {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  status: 'active' | 'inactive' | 'invited' | 'suspended'
  role: 'superadmin' | 'admin' | 'cashier' | 'manager'
  createdAt: Date
  updatedAt: Date
}

// Map API response to UI format
function mapUserToUI(user: UserResponse): UIUser {
  return {
    id: String(user.id),
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    username: user.username || '',
    email: user.email,
    phoneNumber: user.phone_number || '',
    status: user.status,
    role: user.role,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at),
  }
}

export const usersApi = {
  /**
   * Get list of users with pagination
   */
  async list(params?: UsersListParams): Promise<{ users: UIUser[]; total: number }> {
    const response = await apiClient.get<PaginatedResponse<UserResponse>>(
      '/api/v1/users',
      { params }
    )

    return {
      users: response.data.items.map(mapUserToUI),
      total: response.data.total,
    }
  },

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<UIUser> {
    const response = await apiClient.get<UserResponse>(`/api/v1/users/${id}`)
    return mapUserToUI(response.data)
  },

  /**
   * Create new user (superuser only)
   */
  async create(userData: Partial<UserResponse>): Promise<UIUser> {
    const response = await apiClient.post<UserResponse>('/api/v1/users', userData)
    return mapUserToUI(response.data)
  },

  /**
   * Update user by ID (superuser only)
   */
  async update(id: number, userData: Partial<UserResponse>): Promise<UIUser> {
    const response = await apiClient.put<UserResponse>(`/api/v1/users/${id}`, userData)
    return mapUserToUI(response.data)
  },

  /**
   * Delete user by ID (superuser only)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/v1/users/${id}`)
  },
}
