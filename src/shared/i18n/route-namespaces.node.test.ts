import { describe, expect, it } from 'vitest'
import { namespaceForPath } from './route-namespaces'

describe('namespaceForPath', () => {
  it('maps a section to its snake_case namespace', () => {
    expect(namespaceForPath('/admin/club-point/config')).toBe('club_point')
    expect(namespaceForPath('/admin/seller-package')).toBe('seller_package')
    expect(namespaceForPath('/admin/pos')).toBe('pos')
  })

  it('ignores sections without a namespace', () => {
    expect(namespaceForPath('/admin')).toBeUndefined()
    expect(namespaceForPath('/admin/permissions')).toBeUndefined()
  })
})
