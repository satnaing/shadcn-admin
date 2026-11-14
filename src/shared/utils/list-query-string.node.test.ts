import { describe, expect, it } from 'vitest'
import { buildListQueryString, toServerListParams } from './list-query-string'

describe('toServerListParams', () => {
  it('maps table URL state to ?q&page&per_page&sort with descending as -field', () => {
    const params = toServerListParams(
      { q: 'abc', page: 2, pageSize: 20, sort: 'title', order: 'asc', status: 'draft' },
      { filters: ['status', 'lang'] }
    )
    expect(buildListQueryString(params)).toBe('q=abc&page=2&per_page=20&sort=title&status=draft')
  })

  it('falls back to the table defaults and drops empty filters', () => {
    const params = toServerListParams({}, { defaultSort: 'updated_at', filters: ['status'] })
    expect(buildListQueryString(params)).toBe('page=1&per_page=10&sort=-updated_at')
  })
})
