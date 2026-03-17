import apiClient from '@/lib/api-client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginUser {
  user_id: string
  user_key: string
  username: string
  permissions: string[]
  routes: unknown[]
}

export interface LoginResponse {
  status: number
  message: string
  data: {
    user: LoginUser
    accessToken: string
    expire_time: number
  }
}

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/geerule/login', payload)
  return data
}
