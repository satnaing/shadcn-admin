import { destroyCookie, parseCookies, setCookie } from 'nookies'
import type { StateStorage } from 'zustand/middleware'
import { MODE } from './constant'

export const cookiePersistStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    try {
      setCookie(null, name, value, {
        maxAge: 1 * 24 * 60 * 60, // 1 day
        path: '/',
        sameSite: 'lax',
        secure: MODE === 'production',
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Cookie set error:', error)
    }
  },

  getItem: (name: string) => {
    try {
      const cookies = parseCookies()
      return cookies[name] || null
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Cookie get error:', error)
      return null
    }
  },

  removeItem: (name: string) => {
    try {
      destroyCookie(null, name, {
        path: '/',
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Cookie remove error:', error)
    }
  },
}
