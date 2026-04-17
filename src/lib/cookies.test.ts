import { beforeEach, describe, expect, it } from 'vitest'
import { getCookie, removeCookie, setCookie } from './cookies'

describe('cookies', () => {
  const uniqueName = () => `test_cookie_${Math.random().toString(36).slice(2)}`

  beforeEach(() => {
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0]?.trim()
      if (name?.startsWith('test_cookie_')) {
        removeCookie(name)
      }
    }
  })

  it('stores a value that can be read back', () => {
    const name = uniqueName()
    const value = 'hello-world'

    setCookie(name, value)

    expect(getCookie(name)).toBe(value)
  })

  it('clears a value so it is no longer readable', () => {
    const name = uniqueName()

    setCookie(name, 'x')
    expect(getCookie(name)).toBe('x')

    removeCookie(name)

    expect(getCookie(name)).toBeUndefined()
  })
})
