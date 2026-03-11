import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

const clearAuthAndRedirect = (reason: 'revoked' | 'expired' = 'expired') => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('currentSessionId')
  localStorage.removeItem('activeShopId')
  localStorage.removeItem('currentUser')

  toast.error(
    reason === 'revoked' ? 'Session terminated' : 'Session expired',
    {
      description:
        reason === 'revoked'
          ? 'Your session was revoked from another device. Please log in again.'
          : 'Your session has expired. Please log in again.',
      duration: 4000,
    }
  )

  setTimeout(() => {
    window.location.href = '/login'
  }, 1500)
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Standardized Global Logging
    // eslint-disable-next-line no-console
    console.groupCollapsed(
      `%cAPI Request: ${config.method?.toUpperCase()} ${config.url}`,
      'color: #3b82f6; font-weight: bold;'
    )
    // eslint-disable-next-line no-console
    console.log('Method:', config.method?.toUpperCase())
    // eslint-disable-next-line no-console
    console.log('URL:', `${config.baseURL || ''}${config.url}`)
    // eslint-disable-next-line no-console
    console.log('Payload:', config.data)
    // eslint-disable-next-line no-console
    console.log('Params:', config.params)
    // eslint-disable-next-line no-console
    console.groupEnd()

    return config
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    // Standardized Global Logging
    // eslint-disable-next-line no-console
    console.groupCollapsed(
      `%cAPI Response: ${response.status} ${response.config.url}`,
      'color: #10b981; font-weight: bold;'
    )
    // eslint-disable-next-line no-console
    console.log('Status:', response.status)
    // eslint-disable-next-line no-console
    console.log('Data:', response.data)
    // eslint-disable-next-line no-console
    console.groupEnd()

    return response
  },
  async (error: AxiosError) => {
    // eslint-disable-next-line no-console
    console.groupCollapsed(
      `%cAPI Error: ${error.response?.status || 'Unknown'} ${error.config?.url}`,
      'color: #ef4444; font-weight: bold;'
    )
    // eslint-disable-next-line no-console
    console.error('Error Details:', error)
    if (error.response) {
      // eslint-disable-next-line no-console
      console.log('Response Data:', error.response.data)
    }
    // eslint-disable-next-line no-console
    console.groupEnd()

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }
    const status = error.response?.status
    const isAuthEndpoint = originalRequest?.url?.includes('/admin/auth/')

    if (status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        isRefreshing = false
        clearAuthAndRedirect()
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/admin/auth/refresh`,
          { refreshToken }
        )
        const { accessToken, refreshToken: newRefreshToken, sessionId } = response.data

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        if (sessionId) localStorage.setItem('currentSessionId', sessionId)

        processQueue(null, accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuthAndRedirect('revoked')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export { apiClient }
