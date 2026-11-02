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
  navKey: string | null
  landing: string | null
}

export const PANELS: Record<Role, PanelConfig> = {
  admin: {
    panel: 'admin',
    prefix: '/admin',
    navKey: 'admin',
    landing: '/admin',
  },
  staff: {
    panel: 'admin',
    prefix: '/admin',
    navKey: 'admin',
    landing: '/admin',
  },
  seller: {
    panel: 'seller',
    prefix: '/seller',
    navKey: 'seller',
    landing: '/seller',
  },
  seller_staff: {
    panel: 'seller',
    prefix: '/seller',
    navKey: 'seller',
    landing: '/seller',
  },
  courier: {
    panel: 'courier',
    prefix: '/courier',
    navKey: 'courier',
    landing: '/courier',
  },
  supervisor: {
    panel: 'supervisor',
    prefix: '/supervisor',
    navKey: 'supervisor',
    landing: '/supervisor',
  },
  customer: {
    panel: null,
    prefix: null,
    navKey: null,
    landing: null,
  },
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
