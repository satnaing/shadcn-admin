import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'

const without = (list: string[], ...suffixes: string[]) =>
  list.filter((p) => !suffixes.some((s) => p.endsWith(s)))

const SELLER_PERMISSIONS: string[] = [
  PERMISSIONS.DASHBOARD.INDEX,
  ...Object.values(PERMISSIONS.POS),
  ...Object.values(PERMISSIONS.WHOLESALE),
  ...Object.values(PERMISSIONS.CLASSIFIED),
]

const COURIER_PERMISSIONS: string[] = [
  PERMISSIONS.DASHBOARD.INDEX,
  PERMISSIONS.COURIER.DELIVERIES,
  PERMISSIONS.COURIER.DELIVERIES_MANAGE,
  PERMISSIONS.COURIER.CASH_REPORT,
  PERMISSIONS.COURIER.EARNINGS,
  PERMISSIONS.COURIER.PAYMENTS,
  PERMISSIONS.COURIER.COLLECTIONS,
  PERMISSIONS.COURIER.CANCEL_REQUESTS,
]

/** Oversight role: read everything, change nothing. */
const SUPERVISOR_PERMISSIONS: string[] = ALL_PERMISSIONS.filter(
  (p) => p.endsWith('.index') || p.endsWith('.show')
)

/** Mock `auth/me` rights per dev role (see dev-role-switcher). */
export function mockPermissionsForRole(role?: string | null): string[] {
  switch (role) {
    case 'seller':
      return SELLER_PERMISSIONS
    case 'seller_staff':
      return without(SELLER_PERMISSIONS, '.create')
    case 'courier':
      return COURIER_PERMISSIONS
    case 'supervisor':
      return SUPERVISOR_PERMISSIONS
    case 'staff':
      return without(ALL_PERMISSIONS, '.delete', '.install')
    default:
      return ALL_PERMISSIONS
  }
}

const mockUser = {
  id: 1,
  name: 'Admin',
  email: 'admin@allixwork.test',
  avatar: null,
  role: 'admin',
  panel: 'admin',
  seller_id: null,
  status: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

export const authMock = {
  token: 'mock-token',
  token_type: 'Bearer',
  user: mockUser,
  permissions: ALL_PERMISSIONS,
}

/** `GET /auth/me` — follows the role picked in the dev role-switcher. */
export function currentUserMock(role?: string | null) {
  const current = role ?? mockUser.role

  return {
    data: {
      ...mockUser,
      role: current,
      roles: [{ id: 1, name: current }],
      permissions: mockPermissionsForRole(current),
    },
  }
}
