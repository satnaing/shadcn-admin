import { describe, expect, it } from 'vitest'
import { cn, getPageNumbers } from './utils'

describe('getPageNumbers', () => {
  it('returns all pages when total is at most 5', () => {
    expect(getPageNumbers(1, 3)).toEqual([1, 2, 3])
    expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('shows ellipsis near the beginning', () => {
    expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, '...', 10])
    expect(getPageNumbers(3, 10)).toEqual([1, 2, 3, 4, '...', 10])
  })

  it('shows ellipsis near the end', () => {
    expect(getPageNumbers(10, 10)).toEqual([1, '...', 7, 8, 9, 10])
    expect(getPageNumbers(9, 10)).toEqual([1, '...', 7, 8, 9, 10])
  })

  it('shows ellipsis on both side in the middle', () => {
    expect(getPageNumbers(5, 10)).toEqual([1, '...', 4, 5, 6, '...', 10])
  })

  it('handles current page greater than total pages', () => {
    expect(getPageNumbers(6, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPageNumbers(11, 10)).toEqual([1, '...', 7, 8, 9, 10])
  })
})

describe('cn', () => {
  it('returns an empty string when given no inputs', () => {
    expect(cn()).toBe('')
  })

  it('joins multiple class names with a space', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('keeps truthy conditionals and drops falsy ones', () => {
    expect(cn('foo', false && 'hidden', true && 'block')).toBe('foo block')
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('flattens nested arrays of class values', () => {
    expect(cn('foo', ['bar', ['baz', false, 'qux']])).toBe('foo bar baz qux')
  })

  it('resolves tailwind conflicts by keeping the last value', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-red-500', 'text-blue-500', 'font-bold')).toBe(
      'text-blue-500 font-bold'
    )
  })

  it('resolves conflicts across conditionals and arrays', () => {
    expect(cn('p-2', ['p-4'], false && 'p-8', 'p-6')).toBe('p-6')
  })
})
