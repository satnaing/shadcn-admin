import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

/**
 * 创建一个axios实例
 * 配置基础URL和默认请求头
 */
const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // 添加参数序列化配置，使数组参数不带[]后缀
  paramsSerializer: {
    indexes: null // 设置为null时，数组参数格式为 'id=1&id=2' 而非 'id[]=1&id[]=2'
  }
})

/**
 * 请求拦截器
 * 在每个请求发送前添加认证token
 */
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().auth.accessToken
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

/**
 * 响应拦截器
 * 处理常见的响应错误
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 处理401未授权错误
    if (error.response?.status === 401) {
      // 清除登录状态
      useAuthStore.getState().auth.reset()
    }
    return Promise.reject(error)
  }
)

export default axiosInstance 