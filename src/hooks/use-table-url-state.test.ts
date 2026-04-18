import { type Mock, describe, expect, it, vi } from 'vitest'
import { renderHook } from 'vitest-browser-react'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'

function lastNavigateOpts(navigate: Mock<NavigateFn>) {
  const calls = navigate.mock.calls
  return calls[calls.length - 1]?.[0]
}

function applyLastSearchFn(
  navigate: Mock<NavigateFn>,
  prev: Record<string, unknown>
) {
  const opts = lastNavigateOpts(navigate)
  if (!opts) return undefined
  const s = opts.search
  if (typeof s === 'function') {
    return s(prev) as Record<string, unknown>
  }
  return s as Record<string, unknown>
}

describe('useTableUrlState', () => {
  it('derives pagination from search with defaults', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result } = await renderHook(() =>
      useTableUrlState({
        search: { page: 3, pageSize: 25 },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
      })
    )

    expect(result.current.pagination).toEqual({
      pageIndex: 2,
      pageSize: 25,
    })
  })

  it('uses default page and pageSize when search omits them', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result } = await renderHook(() =>
      useTableUrlState({
        search: {},
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
      })
    )

    expect(result.current.pagination).toEqual({
      pageIndex: 0,
      pageSize: 10,
    })
  })

  it('clamps negative effective page via pageIndex', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result } = await renderHook(() =>
      useTableUrlState({
        search: { page: 0 },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
      })
    )

    expect(result.current.pagination.pageIndex).toBe(0)
  })

  it('onPaginationChange omits page and pageSize from search when they match defaults', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const prev = { page: 2, pageSize: 20, filter: 'q' }
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: prev,
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
      })
    )

    await act(() => {
      result.current.onPaginationChange({
        pageIndex: 0,
        pageSize: 10,
      })
    })

    expect(applyLastSearchFn(navigate, prev)).toMatchObject({
      page: undefined,
      pageSize: undefined,
      filter: 'q',
    })
  })

  it('onPaginationChange writes non-default page and pageSize', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const prev = { filter: 'x' }
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: { ...prev, page: 1, pageSize: 10 },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
      })
    )

    await act(() => {
      result.current.onPaginationChange({
        pageIndex: 2,
        pageSize: 25,
      })
    })

    expect(applyLastSearchFn(navigate, prev)).toMatchObject({
      page: 3,
      pageSize: 25,
      filter: 'x',
    })
  })

  it('supports custom pagination search keys', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result } = await renderHook(() =>
      useTableUrlState({
        search: { p: 2, ps: 5 },
        navigate,
        pagination: {
          pageKey: 'p',
          pageSizeKey: 'ps',
          defaultPage: 1,
          defaultPageSize: 10,
        },
      })
    )

    expect(result.current.pagination).toEqual({
      pageIndex: 1,
      pageSize: 5,
    })
  })

  it('reads globalFilter from search and onGlobalFilterChange updates URL and clears page', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: { page: 2, filter: 'hello' },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        globalFilter: { enabled: true, key: 'filter' },
      })
    )

    expect(result.current.globalFilter).toBe('hello')

    await act(() => {
      result.current.onGlobalFilterChange?.('  next  ')
    })

    expect(applyLastSearchFn(navigate, { page: 2, filter: 'hello' })).toEqual({
      page: undefined,
      filter: 'next',
    })
  })

  it('clears filter key in URL when global filter becomes empty after trim', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: { filter: 'x' },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        globalFilter: { enabled: true, key: 'filter' },
      })
    )

    await act(() => {
      result.current.onGlobalFilterChange?.('   ')
    })

    expect(applyLastSearchFn(navigate, { filter: 'x' })).toMatchObject({
      filter: undefined,
    })
  })

  it('does not trim global filter when trim is false', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: {},
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        globalFilter: { enabled: true, key: 'filter', trim: false },
      })
    )

    await act(() => {
      result.current.onGlobalFilterChange?.('  spaced  ')
    })

    expect(applyLastSearchFn(navigate, {})).toMatchObject({
      filter: '  spaced  ',
    })
  })

  it('omits globalFilter and onGlobalFilterChange when global filter is disabled', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result } = await renderHook(() =>
      useTableUrlState({
        search: { filter: 'ignored' },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        globalFilter: { enabled: false },
      })
    )

    expect(result.current.globalFilter).toBeUndefined()
    expect(result.current.onGlobalFilterChange).toBeUndefined()
  })

  it('builds array column filters from search', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result } = await renderHook(() =>
      useTableUrlState({
        search: { status: ['todo', 'done'], priority: ['high'] },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        columnFilters: [
          { columnId: 'status', searchKey: 'status', type: 'array' },
          { columnId: 'priority', searchKey: 'priority', type: 'array' },
        ],
      })
    )

    expect(result.current.columnFilters).toEqual([
      { id: 'status', value: ['todo', 'done'] },
      { id: 'priority', value: ['high'] },
    ])
  })

  it('builds string column filters from search', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result } = await renderHook(() =>
      useTableUrlState({
        search: { q: '  find me  ' },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        columnFilters: [{ columnId: 'title', searchKey: 'q', type: 'string' }],
      })
    )

    expect(result.current.columnFilters).toEqual([
      { id: 'title', value: '  find me  ' },
    ])
  })

  it('onColumnFiltersChange merges serialized filters into search and clears page', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const prev = { page: 3, status: ['old'], other: 1 }
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: prev,
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        columnFilters: [
          { columnId: 'status', searchKey: 'status', type: 'array' },
          { columnId: 'priority', searchKey: 'priority', type: 'array' },
        ],
      })
    )

    await act(() => {
      result.current.onColumnFiltersChange([
        { id: 'status', value: ['todo'] },
        { id: 'priority', value: [] },
      ])
    })

    expect(applyLastSearchFn(navigate, prev)).toEqual({
      page: undefined,
      status: ['todo'],
      priority: undefined,
      other: 1,
    })
  })

  it('ensurePageInRange navigates with replace when current page exceeds pageCount', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: { page: 5 },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
      })
    )

    await act(() => {
      result.current.ensurePageInRange(2)
    })

    expect(navigate).toHaveBeenCalledTimes(1)
    expect(lastNavigateOpts(navigate)?.replace).toBe(true)
    expect(applyLastSearchFn(navigate, { page: 5, filter: 'x' })).toMatchObject(
      {
        page: undefined,
        filter: 'x',
      }
    )
  })

  it('ensurePageInRange resets to last page when resetTo is last', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: { page: 9 },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
      })
    )

    await act(() => {
      result.current.ensurePageInRange(3, { resetTo: 'last' })
    })

    expect(lastNavigateOpts(navigate)?.replace).toBe(true)
    expect(applyLastSearchFn(navigate, { page: 9 })).toMatchObject({
      page: 3,
    })
  })

  it('ensurePageInRange does not navigate when page is in range', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: { page: 2 },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
      })
    )

    await act(() => {
      result.current.ensurePageInRange(5)
    })

    expect(navigate).not.toHaveBeenCalled()
  })

  it('uses custom serialize and deserialize for column filters', async () => {
    const navigate = vi.fn() as Mock<NavigateFn>
    const { result, act } = await renderHook(() =>
      useTableUrlState({
        search: { tag: 'a|b' },
        navigate,
        pagination: { defaultPage: 1, defaultPageSize: 10 },
        columnFilters: [
          {
            columnId: 'tag',
            searchKey: 'tag',
            type: 'array',
            deserialize: (v) => (typeof v === 'string' ? v.split('|') : []),
            serialize: (v) => (Array.isArray(v) ? v.join('|') : v),
          },
        ],
      })
    )

    expect(result.current.columnFilters).toEqual([
      { id: 'tag', value: ['a', 'b'] },
    ])

    await act(() => {
      result.current.onColumnFiltersChange([{ id: 'tag', value: ['x', 'y'] }])
    })

    expect(applyLastSearchFn(navigate, { tag: 'a|b' })).toMatchObject({
      tag: 'x|y',
    })
  })
})
