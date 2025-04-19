import axiosInstance from '@/lib/axios'
import { AuthUser } from '@/stores/authStore'

/**
 * 登录响应接口
 */
export interface LoginResponse {
  success: boolean
  message: string
}

/**
 * 登录请求参数接口
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * 认证服务
 * 提供登录、登出和获取用户信息的方法
 */
export const authService = {
  /**
   * 用户登录
   * @param data 登录信息
   * @returns Promise<LoginResponse>
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      // 创建表单数据
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('password', data.password)

      const response = await axiosInstance.post<LoginResponse>('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error: any) {
      console.error('登录请求失败:', error)
      return {
        success: false,
        message: error.response?.data?.message || '登录请求失败，请稍后再试',
      }
    }
  },

  /**
   * 用户登出
   * @returns Promise<boolean>
   */
  async logout(): Promise<boolean> {
    try {
      const response = await axiosInstance.post<{ success: boolean }>('/auth/logout')
      return response.data.success
    } catch (error) {
      console.error('退出登录失败:', error)
      return false
    }
  },

  /**
   * 获取当前用户信息
   * @returns Promise<Me | null>
   */
  async getUserInfo(): Promise<AuthUser | null> {
    try {
      const response = await axiosInstance.get<AuthUser>('/auth/me')
      return response.data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }
} 