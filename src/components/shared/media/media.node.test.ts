import { describe, expect, it } from 'vitest'
import { kindOf, matchesAccept, moveItem, refsToUrl, toggleFile, urlToRefs } from './media.logic'
import type { MediaRef } from './media.type'

const f = (id: number, type: MediaRef['type'] = 'image'): MediaRef => ({ id, url: `u${id}`, name: `n${id}`, type, size: 1 })

describe('media logic', () => {
  it('classifies and filters by accept', () => {
    expect(kindOf('image/png')).toBe('image')
    expect(kindOf('application/pdf')).toBe('document')
    expect(matchesAccept(f(1), 'file')).toBe(false)
    expect(matchesAccept(f(1, 'document'), 'file')).toBe(true)
    expect(matchesAccept(f(1, 'document'), 'any')).toBe(true)
  })
  it('toggles with a cap and replaces in single mode', () => {
    expect(toggleFile([f(1)], f(2), false)).toEqual([f(2)])
    expect(toggleFile([f(1)], f(1), false)).toEqual([])
    expect(toggleFile([f(1)], f(2), true, 2)).toEqual([f(1), f(2)])
    expect(toggleFile([f(1), f(2)], f(3), true, 2)).toEqual([f(1), f(2)])
    expect(toggleFile([f(1), f(2)], f(1), true)).toEqual([f(2)])
  })
  it('moves items and bridges url strings', () => {
    expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1])
    expect(moveItem([1, 2], 5, 0)).toEqual([1, 2])
    expect(refsToUrl(urlToRefs('https://x/a.png'))).toBe('https://x/a.png')
    expect(urlToRefs('')).toEqual([])
  })
})
