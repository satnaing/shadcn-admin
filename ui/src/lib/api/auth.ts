/**
 * Authentication API service
 */
import { apiClient, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/api-client'
import { setCookie, removeCookie } from '@/lib/cookies'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  username?: string
  first_name?: string
  last_name?: string
  phone_number?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserResponse {
  id: number
  email: string
  username: string | null
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  role: 'superadmin' | 'admin' | 'manager' | 'cashier'
  status: 'active' | 'inactive' | 'invited' | 'suspended'
  is_superuser: boolean
  created_at: string
  updated_at: string
}

export const authApi = {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>(
      '/api/v1/auth/login',
      data
    )

    // Store tokens
    setCookie(ACCESS_TOKEN_KEY, response.data.access_token)
    setCookie(REFRESH_TOKEN_KEY, response.data.refresh_token)

    return response.data
  },

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>(
      '/api/v1/auth/register',
      data
    )
    return response.data
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>(
      '/api/v1/auth/refresh',
      { refresh_token: refreshToken }
    )

    // Update stored tokens
    setCookie(ACCESS_TOKEN_KEY, response.data.access_token)
    setCookie(REFRESH_TOKEN_KEY, response.data.refresh_token)

    return response.data
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>('/api/v1/auth/me')
    return response.data
  },

  /**
   * Logout user
   */
  logout(): void {
    removeCookie(ACCESS_TOKEN_KEY)
    removeCookie(REFRESH_TOKEN_KEY)
  },
}
