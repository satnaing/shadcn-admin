import { describe, expect, it } from 'vitest'
import { toNavGroups } from '@/api/adapters/menu.adapter'
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
    expect(keys(merged).slice(coreKeys.length)).toEqual(['module-pos', 'module-wholesale', 'module-delivery-boy'])
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
