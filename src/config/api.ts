import type { AxiosRequestConfig } from 'axios'
import { instance } from '@/config/interceptor'

interface ApiRequestInterface {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T, K = unknown>(url: string, data?: K, options?: AxiosRequestConfig): Promise<T>
  put<T, K = unknown>(url: string, data?: K, options?: AxiosRequestConfig): Promise<T>
  patch<T, K = unknown>(url: string, data?: K, options?: AxiosRequestConfig): Promise<T>
  delete<T>(url: string): Promise<T>
}

class ApiRequestClient implements ApiRequestInterface {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await instance.get<T>(url, config)
    return response.data
  }

  async post<T, K = unknown>(
    url: string,
    data?: K,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response = await instance.post<T>(url, data, options)
    return response.data
  }

  async put<T, K = unknown>(
    url: string,
    data?: K,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response = await instance.put<T>(url, data, options)
    return response.data
  }

  async patch<T, K = unknown>(
    url: string,
    data?: K,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response = await instance.patch<T>(url, data, options)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await instance.delete<T>(url)
    return response.data
  }
}

const requestInstanceClient = new ApiRequestClient()

export { requestInstanceClient }
