import { describe, expect, it } from 'vitest'
import { addMany, addTag, joinTags, removeTag, splitTags } from './tag-input.logic'

describe('tag input logic', () => {
  it('round-trips the comma string', () => {
    expect(splitTags(' a, b ,,c ')).toEqual(['a', 'b', 'c'])
    expect(joinTags(['a', 'b'])).toBe('a, b')
  })
  it('rejects empty, duplicate (any case), too long and too many', () => {
    expect(addTag(['Red'], 'red').rejected).toBe('duplicate')
    expect(addTag([], '   ').rejected).toBe('empty')
    expect(addTag([], 'x'.repeat(6), { maxLength: 5 }).rejected).toBe('tooLong')
    expect(addTag(['a'], 'b', { maxTags: 1 }).rejected).toBe('tooMany')
    expect(addTag(['a'], ' b ').tags).toEqual(['a', 'b'])
  })
  it('adds pasted lists and removes by index', () => {
    expect(addMany(['a'], 'b, a, c').tags).toEqual(['a', 'b', 'c'])
    expect(removeTag(['a', 'b', 'c'], 1)).toEqual(['a', 'c'])
  })
})
