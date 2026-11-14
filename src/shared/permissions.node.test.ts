import { describe, expect, it } from 'vitest'
import { navCore } from '@/components/layout/data/nav.core'
import { mockPermissionsForRole } from '@/mocks/auth'
import { ALL_PERMISSIONS, PERMISSIONS } from './permissions'

describe('permission tree', () => {
  it('has unique, well-formed names and no *_own keys', () => {
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    for (const p of ALL_PERMISSIONS) {
      expect(p).toMatch(/^[a-z_]+\.[a-z_]+$/)
      expect(p.endsWith('_own')).toBe(false)
    }
  })

  it('is the single source: admin mock gets exactly the tree, roles are subsets', () => {
    expect(mockPermissionsForRole('admin')).toEqual(ALL_PERMISSIONS)
    for (const role of ['staff', 'seller', 'seller_staff', 'courier', 'supervisor']) {
      expect(mockPermissionsForRole(role).every((p) => ALL_PERMISSIONS.includes(p))).toBe(true)
    }
    expect(Object.keys(PERMISSIONS)).toContain('MODULES')
  })

  it('every core nav permission exists in the tree', () => {
    const used = navCore.flatMap((g) =>
      g.items.flatMap((i) => [i.permission, ...(i.items?.map((c) => c.permission) ?? [])])
    )
    for (const p of used.filter(Boolean)) expect(ALL_PERMISSIONS).toContain(p)
  })
})
