import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import { mockRoutes } from '@/mocks'

const LATENCY_MS = 150

function match(method: string, path: string) {
  for (const [key, handler] of Object.entries(mockRoutes)) {
    const [routeMethod, routePath] = key.split(' ')
    if (!routeMethod.split('|').includes(method)) continue

    const routeParts = routePath.split('/')
    const pathParts = path.split('/')
    if (routeParts.length !== pathParts.length) continue

    const params: string[] = []
    const hit = routeParts.every((part, index) => {
      if (part.startsWith(':')) {
        params.push(pathParts[index])
        return true
      }
      return part === pathParts[index]
    })

    if (hit) return { handler, params }
  }
  return null
}

/**
 * API hazır olmayana qədər cavabları fixture-dan verir (`VITE_API_MOCK=1`).
 * Service faylları bundan xəbərsizdir — kəsmə axios adapter səviyyəsindədir.
 */
export function installMockAdapter(instance: AxiosInstance) {
  if (env.VITE_API_MOCK !== '1') return

  instance.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    const method = (config.method ?? 'get').toUpperCase()
    const [rawPath, rawQuery] = (config.url ?? '').split('?')
    const path = rawPath.replace(/\/+$/, '')
    const found = match(method, path)

    await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))

    if (!found) {
      return Promise.reject(
        Object.assign(new Error(`mock yoxdur: ${method} ${path}`), {
          config,
          response: { status: 404, data: { message: `mock yoxdur: ${method} ${path}` }, config },
        })
      )
    }

    const query = Object.fromEntries(new URLSearchParams(rawQuery ?? ''))
    return {
      data: found.handler({ params: found.params, query }),
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse
  }
}
