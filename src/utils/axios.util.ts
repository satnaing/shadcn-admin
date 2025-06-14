import axios from 'axios'
import { getAuthToken, signOut } from '@/features/auth/utils/auth.util'
import { envConfig } from '../config/env.config'

export const axiosInstance = axios.create({
  baseURL: envConfig.apiUrl,
})

export const axiosInstanceWithoutToken = axios.create({
  baseURL: envConfig.apiUrl,
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (request) => {
    if (request.headers) {
      request.headers.Authorization = `Bearer ${getAuthToken()}`
    }
    return request
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const statusCode = error.response.status
      const statusText =
        error.response.data?.message ||
        error.response.statusText ||
        error.message ||
        'Something went wrong'

      let formattedStatus: string

      if (Array.isArray(statusText)) {
        formattedStatus = statusText.join(', ')
      } else {
        formattedStatus = String(statusText)
      }

      if (statusCode === 401) {
        signOut()
      }

      return Promise.reject({
        status: statusCode,
        message: formattedStatus,
      })
    }

    return Promise.reject({
      status: error.code || 'UNKNOWN',
      message: error.message || 'An unknown error occurred',
    })
  }
)
