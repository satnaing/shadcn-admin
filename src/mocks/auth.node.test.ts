import { describe, expect, it } from 'vitest'
import { PERMISSIONS } from '@/shared/permissions'
import { mockPermissionsForRole } from './auth'

describe('seller seed rights (AEC: packages and in-house lists are admin screens)', () => {
  const seller = mockPermissionsForRole('seller')

  it('has no classified package rights', () => {
    expect(seller).not.toContain(PERMISSIONS.CLASSIFIED.PACKAGES)
    expect(seller).not.toContain(PERMISSIONS.CLASSIFIED.PACKAGES_MANAGE)
    expect(seller).toContain(PERMISSIONS.CLASSIFIED.INDEX)
  })
  it('has no wholesale in-house / all-sellers lists but can manage its own', () => {
    expect(seller).not.toContain(PERMISSIONS.WHOLESALE.INHOUSE)
    expect(seller).not.toContain(PERMISSIONS.WHOLESALE.SELLERS)
    expect(seller).toContain(PERMISSIONS.WHOLESALE.CREATE)
  })
  it('POS: no activation switch', () => {
    expect(seller).not.toContain(PERMISSIONS.POS.ACTIVATION_MANAGE)
  })
})
