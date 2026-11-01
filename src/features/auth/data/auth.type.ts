import type { CurrentUserInterface } from '@/features/users/data/users.type'

export type AuthStoreType = {
  user: Omit<CurrentUserInterface, 'permissions'> | null
  accessToken: string | null
  setUser: (user: Omit<CurrentUserInterface, 'permissions'>) => void
  setAccessToken: (accessToken: string) => void

  clean: () => void
}

export type PermissionStoreType = {
  permissions: string[]

  setPermissions: (permissions: string[]) => void
  clearPermissions: () => void
  loading: boolean

  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
}

export interface RegisterInterface {
  name: string
  email: string
  country_code: number
  phone: string
  password: string
  role: string // temp
  referral_code: string
  fcm_token: string
}

export interface LoginInterface {
  email: string
  password: string
}

export type AuthLoginResponseType = {
  user: {
    id: number
    name: string
    email: string
    status: boolean
    created_at: string
    updated_at: string
  }
  token: string
  token_type: string
}
