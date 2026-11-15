import { describe, expect, it } from 'vitest'
import { routeExists, toNavGroups } from '@/api/adapters/menu.adapter'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS } from '@/shared/permissions'
import { mergeSidebar } from './merge-sidebar'
import { navCore } from './nav.core'

const allowAll = (p: string) => ALL_PERMISSIONS.includes(p)
const keys = (groups: { key: string }[]) => groups.map((g) => g.key)

describe('sidebar merge', () => {
  it('puts core groups first in the fixed order, then module groups by order', () => {
    const merged = mergeSidebar(navCore, toNavGroups(menuFor('admin')), allowAll)
    const coreKeys = keys(navCore)

    expect(keys(merged).slice(0, coreKeys.length)).toEqual(coreKeys)
    expect(keys(merged).slice(coreKeys.length)).toEqual(['module-pos', 'module-wholesale', 'module-delivery-boy', 'module-qrcode-event'])
  })

  it('hides the group of a disabled module', () => {
    const pos = mockModules.find((m) => m.id === 'pos')!
    pos.enabled = false
    try {
      expect(keys(toNavGroups(menuFor('admin')))).not.toContain('module-pos')
    } finally {
      pos.enabled = true
    }
  })

  it('filters module groups by panel and drops items without permission', () => {
    expect(keys(toNavGroups(menuFor('courier')))).toEqual(['module-delivery-boy'])
    const merged = mergeSidebar([], toNavGroups(menuFor('admin')), (p) => p === 'pos.index')
    expect(merged.map((g) => g.items.length)).toEqual([1])
  })

  it('tolerates a missing/garbled menu response', () => {
    expect(toNavGroups(undefined)).toEqual([])
    expect(toNavGroups({} as never)).toEqual([])
  })
})

describe('module menu: screens that are not built yet', () => {
  const paths = ['/admin', '/admin/pos', '/admin/$', '/admin/blogs/$id']

  it('routeExists: exact, param and trailing-slash matches; splat never counts', () => {
    expect(routeExists('/admin/pos/', paths)).toBe(true)
    expect(routeExists('/admin/blogs/7', paths)).toBe(true)
    expect(routeExists('/admin/pos/orders', paths)).toBe(false)
    expect(routeExists('/admin/anything', paths)).toBe(false)
  })

  it('marks unbuilt items disabled, built ones not, and nothing when paths are unknown', () => {
    const flat = (gs: ReturnType<typeof toNavGroups>) => gs.flatMap((g) => g.items).map((i) => [i.key, i.disabled])
    const posGroup = (gs: ReturnType<typeof toNavGroups>) => gs.filter((g) => g.key === 'module-pos')

    expect(flat(posGroup(toNavGroups(menuFor('admin'), paths)))).toEqual([
      ['posTerminal', false],
      ['posOrders', true],
      ['posProducts', true],
    ])
    expect(flat(posGroup(toNavGroups(menuFor('admin')))).every(([, d]) => d === undefined)).toBe(true)
  })

  it('disabled items survive the permission filter', () => {
    const merged = mergeSidebar([], toNavGroups(menuFor('admin'), paths), allowAll)
    expect(merged.flatMap((g) => g.items).some((i) => i.disabled)).toBe(true)
  })
})
