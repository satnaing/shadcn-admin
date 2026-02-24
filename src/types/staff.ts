export interface Role {
  id: string
  businessId?: string
  name: { en: string }
  slug: string
  description?: { en: string }
}

export interface StaffShopAccess {
  staffId: string
  shopId: string
  roleId: string
  role?: Role
  shop?: { id: string; name: string }
}

export interface Staff {
  id: string
  businessId?: string
  globalRoleId?: string
  username: string
  fullName: string
  phone: string
  profileImageUrl?: string
  pinHash?: string // Mocked for now
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  access: StaffShopAccess[]
}

export interface StaffShift {
  id: string
  staffId: string
  shopId: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  roleId?: string
}
