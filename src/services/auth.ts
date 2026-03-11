import {
  type StaffLoginResponse,
  type ChangePasswordRequest,
  type StaffSession,
} from '@/types/api'
import { apiClient } from '@/lib/api-client'

export interface StaffLoginDto {
  username: string
  password: string
  deviceName?: string
}

export const login = async (
  data: StaffLoginDto
): Promise<StaffLoginResponse> => {
  const response = await apiClient.post('/admin/auth/login', data)
  return response.data
}

export const refreshAccessToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await apiClient.post('/admin/auth/refresh', { refreshToken })
  return response.data
}

export const logout = async (refreshToken: string): Promise<void> => {
  await apiClient.post('/admin/auth/logout', { refreshToken })
}

export const getSessions = async (): Promise<StaffSession[]> => {
  const response = await apiClient.get('/admin/auth/sessions')
  return response.data
}

export const revokeSession = async (sessionId: string): Promise<void> => {
  await apiClient.delete(`/admin/auth/sessions/${sessionId}`)
}

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<void> => {
  await apiClient.post('/admin/auth/change-password', data)
}
