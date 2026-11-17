import { describe, expect, it } from 'vitest'
import { shouldSearch, toggleOption } from './entity-picker.logic'

const a = { id: 1, label: 'A' }
const b = { id: 2, label: 'B' }

describe('entity picker logic', () => {
  it('multi mode toggles, single mode replaces or clears', () => {
    expect(toggleOption([a], b, true)).toEqual([a, b])
    expect(toggleOption([a, b], a, true)).toEqual([b])
    expect(toggleOption([a], b, false)).toEqual([b])
    expect(toggleOption([a], a, false)).toEqual([])
  })
  it('respects the minimum characters', () => {
    expect(shouldSearch(' a ', 2)).toBe(false)
    expect(shouldSearch('ab', 2)).toBe(true)
    expect(shouldSearch('', 0)).toBe(true)
  })
})
