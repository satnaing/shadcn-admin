import apiClient from '@/lib/api-client'

export interface UserInfo {
  username: string
  email: string
}

interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export const authService = {
  async getUserInfo(): Promise<UserInfo> {
    const response = await apiClient.get<ApiResponse<UserInfo>>('/api/userinfo')

    console.log('API Response:', response.data.data)
    return response.data.data
  },
}