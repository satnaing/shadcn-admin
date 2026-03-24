import axios, { type AxiosInstance } from 'axios'
import { getCookie } from './cookies'
import { toast } from 'sonner'
import { ACCESS_TOKEN } from '@/config/system'


// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 token
apiClient.interceptors.request.use(
  (config) => {
    const cookieState = getCookie(ACCESS_TOKEN)
    const token = cookieState ? JSON.parse(cookieState) : ''

    if (token) {
      config.headers.Authorization = token
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data && typeof data.code === 'number' && data.code !== 200) {
      const msg = data.msg
      toast.error(msg)
      return Promise.reject(new Error(msg))
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

export default apiClient
