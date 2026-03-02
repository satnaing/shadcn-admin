import axios from 'axios'

// Assuming sonner is used for toasts, if not I might need to check. But typical stack uses sonner or similar.
// I will check package.json or imports later if this fails, but for now assuming global toast or simple replace.
// actually, let's use a safe approach. I'll check imports in other files to see what toast library is used.
// The user has `src/hooks/use-toast.ts` usually in shadcn or `sonner`.
// Let's assume standard named import for now or just window.location.href for redirect.

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
  (error) => {
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

    const status = error.response?.status

    if (status === 401) {
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('activeShopId')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export { apiClient }
