export type Role =
  | 'admin'
  | 'staff'
  | 'seller'
  | 'seller_staff'
  | 'courier'
  | 'supervisor'
  | 'customer'

export type Panel = 'admin' | 'seller' | 'courier' | 'supervisor'

export interface PanelConfig {
  panel: Panel | null
  prefix: string | null
  landing: string | null
}

// admin2 has one app shell (`/admin`). Non-admin roles see only the module
// groups declared for their panel (`GET /admin/menu?panel=`), plus core items
// they hold permissions for.
const ADMIN_SHELL = { prefix: '/admin', landing: '/admin' } as const

export const PANELS: Record<Role, PanelConfig> = {
  admin: { panel: 'admin', ...ADMIN_SHELL },
  staff: { panel: 'admin', ...ADMIN_SHELL },
  seller: { panel: 'seller', ...ADMIN_SHELL },
  seller_staff: { panel: 'seller', ...ADMIN_SHELL },
  courier: { panel: 'courier', ...ADMIN_SHELL },
  supervisor: { panel: 'supervisor', ...ADMIN_SHELL },
  customer: { panel: null, prefix: null, landing: null },
}

export function getPanelByRole(role?: string | null): Panel | null {
  if (!role || !(role in PANELS)) {
    return null
  }
  return PANELS[role as Role].panel
}

export function getPanelConfig(role?: string | null): PanelConfig | null {
  if (!role || !(role in PANELS)) {
    return null
  }
  return PANELS[role as Role]
}
