import axios, { type AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from 'axios'

type RetryAxiosRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }
import { toast } from 'sonner'
import { BASE_URL } from '@/shared/constant'
import i18n from '@/shared/i18n'
import { useAuthStore } from '@/features/auth/data/auth.store'
import { installMockAdapter } from '@/config/mock-adapter'

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

function resolveAcceptLanguage(): string {
  const language = i18n.resolvedLanguage || i18n.language || 'en'
  return language.split('-')[0] || 'en'
}

export function buildAuthHeaders(): Record<string, string> {
  const { accessToken } = useAuthStore.getState()
  const headers: Record<string, string> = {}

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return headers
}

installMockAdapter(instance)

instance.interceptors.request.use(async (config) => {
  config.headers = {
    ...(config.headers || {}),
    ...buildAuthHeaders(),
    'Accept-Language': resolveAcceptLanguage(),
  } as unknown as AxiosHeaders

  return config
})

instance.interceptors.response.use(
  async (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig | undefined
    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (error.response?.status === 304) {
      toast.error('Content not modified!')
      return Promise.reject(error)
    }

    if (error.response?.status === 500) {
      toast.error('Internal Server Error!')
      return Promise.reject(error)
    }

    const isLoginRequest = originalRequest.url?.endsWith('/auth/login')
    const isSignInPage = window.location.pathname === '/sign-in'

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest &&
      !isSignInPage
    ) {
      originalRequest._retry = true
      toast.error('Session expired!')
      useAuthStore.getState().clean()
      window.location.assign('/sign-in')
    }

    return Promise.reject(error)
  }
)
